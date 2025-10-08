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
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiBody, ApiOkResponse, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  LoginResponseDto,
  TooManyRequestsResponseDto,
  UnauthorizedResponseDto,
} from './dto/login-response.dto';
import { RateLimitService } from './rate-limit.service';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';
const TOO_MANY_REQUESTS_MESSAGE = 'Too many login attempts. Try again later.';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly rateLimitService: RateLimitService,
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
  ): Promise<{
    message: string;
    user: Omit<User, 'passwordHash'>;
  }> {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);

    const user = await this.authService.register(registerDto);

    return {
      message: 'User successfully registered',
      user,
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
