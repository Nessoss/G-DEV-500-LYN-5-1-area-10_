import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
  TooManyRequestsResponseDto,
  UnauthorizedResponseDto,
} from './dto/login-response.dto';
import { RateLimitService } from './rate-limit.service';
import { GoogleOAuthDto } from './dto/google-oauth.dto';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';
const TOO_MANY_REQUESTS_MESSAGE = 'Too many login attempts. Try again later.';

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
  async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    message: string;
    access_token: string;
    expires_in: number;
    token_type: 'Bearer';
    user: {
      id: string;
      email: string;
      roles: string[];
    };
  }> {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);

    const user = await this.authService.register(registerDto);
    const tokens = await this.authService.generateTokens(user);
    this.authService.setRefreshTokenCookie(response, tokens.refreshToken);
    const loginPayload = this.authService.buildLoginResponse(user, tokens);

    return {
      message: 'User successfully registered',
      ...loginPayload,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
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
      this.logger.warn('Login attempt while locked', {
        email,
        clientIp,
        lockTtlSeconds: status.lockTtlSeconds,
      });
      await this.authService.enforceUnauthorizedDelay();
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    if (status.isRateLimited) {
      this.logger.warn('Rate limit exceeded before credential check', {
        email,
        clientIp,
      });
      throw new BadRequestException(TOO_MANY_REQUESTS_MESSAGE);
    }

    const user = await this.authService.validateUser(email, loginDto.password);

    if (!user) {
      const failureOutcome = await this.rateLimitService.registerFailure(email, clientIp);
      this.logger.warn('Login attempt failed', {
        email,
        clientIp,
        rateLimited: failureOutcome.rateLimited,
        lockDurationSeconds: failureOutcome.lockDurationSeconds,
      });

      await this.authService.enforceUnauthorizedDelay();

      if (failureOutcome.rateLimited) {
        throw new BadRequestException(TOO_MANY_REQUESTS_MESSAGE);
      }

      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    await this.rateLimitService.reset(email, clientIp);

    const tokens = await this.authService.generateTokens(user);
    this.authService.setRefreshTokenCookie(response, tokens.refreshToken);

    this.logger.log('Authentication successful', { email, userId: user.id });

    return this.authService.buildLoginResponse(user, tokens);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    this.authService.clearRefreshTokenCookie(response);
    this.logger.log('Logout successful');
  }

  @Post('oauth2/google')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GoogleOAuthDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Google OAuth is not configured or token is invalid.' })
  async loginWithGoogleOAuth(
    @Body(new ValidationPipe({ whitelist: true })) body: GoogleOAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    if (!this.oauth2Service) {
      this.logger.error('Google OAuth attempted but not configured.');
      throw new BadRequestException('Google OAuth is not configured.');
    }

    const user = await this.oauth2Service.loginWithGoogle(body.token);
    const tokens = await this.authService.generateTokens(user);
    this.authService.setRefreshTokenCookie(response, tokens.refreshToken);

    this.logger.log('Google OAuth login successful', { userId: user.id });

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
