import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  HttpException,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException,
  ValidationPipe,
  Optional,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { OAuth2Service } from './oauth2.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
  TooManyRequestsResponseDto,
  UnauthorizedResponseDto,
} from './dto/login-response.dto';
import { RateLimitService } from './rate-limit.service';
import { GoogleOAuthDto } from './dto/google-oauth.dto';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
} from '../common/dto/error-response.dto';

const INVALID_CREDENTIALS_MESSAGE = 'Identifiants invalides';
const TOO_MANY_REQUESTS_MESSAGE = 'Trop de tentatives de connexion. Réessayez plus tard.';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly rateLimitService: RateLimitService,
    @Optional() private readonly oauth2Service?: OAuth2Service,
  ) {}

  /**
   * Register a new user
   * POST /auth/register
  */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un nouveau compte utilisateur',
    description:
      'Crée un utilisateur avec l’e-mail et le mot de passe fournis, puis émet les jetons d’accès et de rafraîchissement.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Utilisateur enregistré avec succès',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La validation a échoué pour les données fournies',
    type: ValidationErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Un compte existe déjà pour cette adresse e-mail',
    type: ErrorResponseDto,
  })
  async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RegisterResponseDto> {
    this.logger.log(`Tentative d’inscription pour l’e-mail : ${registerDto.email}`);

    const user = await this.authService.register(registerDto);
    const tokens = await this.authService.generateTokens(user);
    this.authService.setRefreshTokenCookie(response, tokens.refreshToken);
    const loginPayload = this.authService.buildLoginResponse(user, tokens);

    return {
      message: 'Utilisateur créé avec succès',
      ...loginPayload,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authentifier un utilisateur par e-mail et mot de passe',
    description:
      'Valide les identifiants, émet les jetons d’accès/de rafraîchissement et positionne le cookie de rafraîchissement.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({
    description: 'La validation des identifiants fournis a échoué',
    type: ValidationErrorResponseDto,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  @ApiTooManyRequestsResponse({ type: TooManyRequestsResponseDto })
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const email = loginDto.email;
    const clientIp = this.extractClientIp(request);

    const status = await this.rateLimitService.evaluate(email, clientIp);

    if (status.isLocked) {
      this.logger.warn('Tentative de connexion alors que le compte est verrouillé', {
        email,
        clientIp,
        lockTtlSeconds: status.lockTtlSeconds,
      });
      await this.authService.enforceUnauthorizedDelay();
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    if (status.isRateLimited) {
      this.logger.warn('Quota de tentatives dépassé avant vérification des identifiants', {
        email,
        clientIp,
      });
      throw new HttpException(
        TOO_MANY_REQUESTS_MESSAGE,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.authService.validateUser(email, loginDto.password);

    if (!user) {
      const failureOutcome = await this.rateLimitService.registerFailure(email, clientIp);
      this.logger.warn('Échec de la tentative de connexion', {
        email,
        clientIp,
        rateLimited: failureOutcome.rateLimited,
        lockDurationSeconds: failureOutcome.lockDurationSeconds,
      });

      await this.authService.enforceUnauthorizedDelay();

      if (failureOutcome.rateLimited) {
        throw new HttpException(
          TOO_MANY_REQUESTS_MESSAGE,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    await this.rateLimitService.reset(email, clientIp);

    const tokens = await this.authService.generateTokens(user);
    this.authService.setRefreshTokenCookie(response, tokens.refreshToken);

    this.logger.log('Authentification réussie', { email, userId: user.id });

    return this.authService.buildLoginResponse(user, tokens);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Révoquer le cookie de jeton de rafraîchissement',
    description: 'Supprime le cookie de rafraîchissement de la réponse et consigne la déconnexion.',
  })
  @ApiNoContentResponse({ description: 'Déconnexion effectuée' })
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    this.authService.clearRefreshTokenCookie(response);
    this.logger.log('Déconnexion réussie');
  }

  @Post('oauth2/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authentifier via Google OAuth',
    description:
      'Échange un jeton Google ID contre des jetons applicatifs. Requiert la configuration du service OAuth2.',
  })
  @ApiBody({ type: GoogleOAuthDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({
    description: 'Google OAuth n’est pas configuré ou le jeton fourni est invalide',
    type: ErrorResponseDto,
  })
  async loginWithGoogleOAuth(
    @Body(new ValidationPipe({ whitelist: true })) body: GoogleOAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    if (!this.oauth2Service) {
      this.logger.error('Tentative de Google OAuth alors que la configuration est absente.');
      throw new BadRequestException('Google OAuth n’est pas configuré.');
    }

    const user = await this.oauth2Service.loginWithGoogle(body.token);
    const tokens = await this.authService.generateTokens(user);
    this.authService.setRefreshTokenCookie(response, tokens.refreshToken);

    this.logger.log('Connexion Google OAuth réussie', { userId: user.id });

    return this.authService.buildLoginResponse(user, tokens);
  }

  private extractClientIp(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string' && forwardedFor.trim().length > 0) {
      const [firstIp] = forwardedFor.split(',');
      if (firstIp) {
        return firstIp.trim();
      }
    }

    if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
      return forwardedFor[0];
    }

    return request.ip ?? request.socket.remoteAddress ?? 'unknown';
  }
}
