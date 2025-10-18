import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { AreasModule } from './areas/areas.module';
import { LetterboxdModule } from './letterboxd/letterboxd.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? undefined
          : [join(__dirname, '..', '..', '.env')],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    AreasModule,
    LetterboxdModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
