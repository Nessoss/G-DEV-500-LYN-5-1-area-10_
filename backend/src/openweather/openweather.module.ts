import { Module } from '@nestjs/common';
import { OpenweatherService } from './openweather.service';
import { OpenweatherController } from './openweather.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OpenweatherService],
  controllers: [OpenweatherController],
  exports: [OpenweatherService],
})
export class OpenweatherModule {}
