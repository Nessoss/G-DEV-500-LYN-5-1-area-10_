import { Module } from '@nestjs/common';
import { WeatherModule } from '../weather/weather.module';
import { DiscordModule } from '../discord/discord.module';
import { WeatherToDiscordController } from './weather-to-discord.controller';
import { WeatherToDiscordService } from './weather-to-discord.service';

@Module({
  imports: [WeatherModule, DiscordModule],
  controllers: [WeatherToDiscordController],
  providers: [WeatherToDiscordService],
  exports: [WeatherToDiscordService],
})
export class WeatherToDiscordModule {}
