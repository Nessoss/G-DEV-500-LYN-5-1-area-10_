import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class OAuth2Service {
  private readonly logger = new Logger(OAuth2Service.name);
  private googleClient: OAuth2Client;

  constructor(private readonly usersService: UsersService) {
    // Initialize Google OAuth2 client
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  /**
   * Verify Google OAuth2 token and return user profile
   * @param token - Google OAuth2 token
   * @returns Google user profile
   */
  async verifyGoogleToken(token: string): Promise<GoogleProfile> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return {
        sub: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture,
      };
    } catch (error) {
      this.logger.error('Failed to verify Google token:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  /**
   * Login or register user with Google OAuth2
   * @param token - Google OAuth2 token
   * @returns User without password hash
   */
  async loginWithGoogle(token: string): Promise<Omit<User, 'passwordHash'>> {
    const googleProfile = await this.verifyGoogleToken(token);
    
    this.logger.log(`Google OAuth2 attempt for email: ${googleProfile.email}`);

    // Check if user already exists
    let user = await this.usersService.findByEmail(googleProfile.email);

    if (!user) {
      // Create new user if doesn't exist
      this.logger.log(`Creating new user for Google account: ${googleProfile.email}`);
      user = await this.usersService.create({
        email: googleProfile.email,
        passwordHash: '', // No password for OAuth2 users
      });

      // Create provider account record
      await this.usersService.createProviderAccount({
        userId: user.id,
        provider: 'google',
        providerUserId: googleProfile.sub,
        accessToken: token,
        refreshToken: null,
        expiresAt: null,
      });
    } else {
      // Update existing provider account or create if doesn't exist
      await this.usersService.upsertProviderAccount({
        userId: user.id,
        provider: 'google',
        providerUserId: googleProfile.sub,
        accessToken: token,
        refreshToken: null,
        expiresAt: null,
      });
    }

    this.logger.log(`Google OAuth2 login successful for user ID: ${user.id}`);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
