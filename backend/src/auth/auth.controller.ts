import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
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
import { JwtService } from '@nestjs/jwt';
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
import { UsersService } from '../users/users.service';
import { AuthConfigService } from './auth.config';


const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';
const TOO_MANY_REQUESTS_MESSAGE = 'Too many login attempts. Try again later.';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly rateLimitService: RateLimitService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly authConfigService: AuthConfigService,
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

  /**
   * Start Spotify OAuth flow
   */
  @Get('spotify')
  async spotifyAuth(
    @Query('token') token: string,
    @Req() request: Request, 
    @Res() response: Response
  ): Promise<void> {
    let userId: number;

    if (token) {
      // Token passed as query parameter (from frontend)
      try {
        const payload = this.jwtService.verify(token, {
          publicKey: this.authConfigService.accessPublicKey,
          algorithms: ['RS256'],
          issuer: this.authConfigService.jwtIssuer,
          audience: this.authConfigService.jwtAudience,
        }) as { sub: string };
        userId = parseInt(payload.sub, 10);
      } catch (error) {
        this.logger.error('Invalid token in Spotify auth request', error);
        response.redirect(`${process.env.FRONTEND_URL}/connections?error=invalid_token`);
        return;
      }
    } else {
      // Try to get from JWT guard (if user is authenticated via header)
      const user = request.user as { id: number } | undefined;
      if (!user) {
        response.redirect(`${process.env.FRONTEND_URL}/connections?error=not_authenticated`);
        return;
      }
      userId = user.id;
    }

    const spotifyAuthUrl = this.buildSpotifyAuthUrl(userId);
    response.redirect(spotifyAuthUrl);
  }

  /**
   * Handle Spotify OAuth callback
   */
  @Get('spotify/callback')
  async spotifyCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    if (error) {
      this.logger.error(`Spotify OAuth error: ${error}`);
      response.redirect(`${process.env.FRONTEND_URL}/connections?error=spotify_auth_failed`);
      return;
    }

    if (!code) {
      this.logger.error('Spotify OAuth callback missing authorization code');
      response.redirect(`${process.env.FRONTEND_URL}/connections?error=missing_code`);
      return;
    }

    try {
      // Extract userId from state parameter
      const userId = this.extractUserIdFromState(state);
      if (!userId) {
        this.logger.error('Invalid state parameter - cannot extract user ID');
        response.redirect(`${process.env.FRONTEND_URL}/connections?error=invalid_state`);
        return;
      }

      // Exchange code for tokens
      const tokens = await this.exchangeSpotifyCode(code);
      
      // Get user info from Spotify
      const spotifyUser = await this.fetchSpotifyUser(tokens.access_token);
      
      this.logger.log(`Spotify callback received for user ${userId}`);

      // Store Spotify connection
      await this.usersService.upsertProviderAccount({
        userId: userId,
        provider: 'spotify',
        providerUserId: spotifyUser.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      });

      this.logger.log(`Spotify account connected for user ${userId}`);
      response.redirect(`${process.env.FRONTEND_URL}/connections?success=spotify_connected`);
    } catch (error) {
      this.logger.error(`Spotify OAuth callback error: ${error.message}`);
      response.redirect(`${process.env.FRONTEND_URL}/connections?error=connection_failed`);
    }
  }

  private buildSpotifyAuthUrl(userId: number): string {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_CALLBACK_URL || 'http://localhost:8080/auth/spotify/callback';
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-library-modify',
      'user-read-currently-playing',
      'user-read-playback-state',
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-follow-read',
      'user-follow-modify',
    ].join(' ');

    // Include userId in state for OAuth callback
    const state = `${userId}_${Math.random().toString(36).substring(7)}`;
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId!,
      scope: scopes,
      redirect_uri: redirectUri,
      state: state,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  private extractUserIdFromState(state: string): number | null {
    if (!state) return null;
    
    const parts = state.split('_');
    if (parts.length < 2) return null;
    
    const userId = parseInt(parts[0], 10);
    return isNaN(userId) ? null : userId;
  }

  private async exchangeSpotifyCode(code: string): Promise<any> {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_CALLBACK_URL || 'http://localhost:8080/auth/spotify/callback';

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Spotify token exchange failed: ${response.status}`);
    }

    return response.json();
  }

  private async fetchSpotifyUser(accessToken: string): Promise<any> {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify user fetch failed: ${response.status}`);
    }

    return response.json();
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
