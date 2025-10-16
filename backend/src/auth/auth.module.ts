import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuth2Service } from './oauth2.service';
import { UsersModule } from '../users/users.module';
import { AuthConfigService } from './auth.config';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RateLimitService } from './rate-limit.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthConfigService,
    RateLimitService,
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [OAuth2Service]
      : []),
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
