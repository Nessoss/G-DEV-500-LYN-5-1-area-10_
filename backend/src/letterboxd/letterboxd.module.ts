import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LetterboxdService } from './letterboxd.service';
import { LetterboxdController } from './letterboxd.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron jobs
    DatabaseModule,
    AuthModule,
  ],
  controllers: [LetterboxdController],
  providers: [LetterboxdService],
  exports: [LetterboxdService],
})
export class LetterboxdModule {}
