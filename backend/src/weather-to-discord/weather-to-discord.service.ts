import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { DiscordService } from '../discord/discord.service';
import { WeatherToDiscordResponseDto } from './dto/weather-to-discord.dto';

@Injectable()
export class WeatherToDiscordService {
  private readonly logger = new Logger(WeatherToDiscordService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly discordService: DiscordService,
  ) {}

  /**
   * Check weather for a city and send Discord alert if it's raining
   * @param city City name to check weather for
   * @param webhookUrl Discord webhook URL to send alert to
   * @returns Response with weather check and notification results
   */
  async checkWeatherAndNotify(
    city: string,
    webhookUrl: string,
  ): Promise<WeatherToDiscordResponseDto> {
    this.logger.log(`Starting weather-to-discord check for city: ${city}`);

    try {
      // Step 1: Check weather for the city
      const weatherData = await this.weatherService.checkWeather(city);

      this.logger.log(
        `Weather data retrieved for ${city}: ${weatherData.condition} (${weatherData.description}), Raining: ${weatherData.isRaining}`,
      );

      const response: WeatherToDiscordResponseDto = {
        success: true,
        message: `Weather checked for ${city}. ${weatherData.condition} detected.`,
        city: weatherData.city,
        weatherCondition: weatherData.condition,
        isRaining: weatherData.isRaining,
        messageSent: false,
      };

      // Step 2: If it's raining, send Discord alert
      if (weatherData.isRaining) {
        this.logger.log(`Rain detected in ${city}, sending Discord alert`);

        try {
          const discordResponse = await this.discordService.sendWeatherAlert(
            webhookUrl,
            weatherData.city,
            weatherData.condition,
            weatherData.temperature,
          );

          if (discordResponse.success) {
            response.messageSent = true;
            response.discordMessageId = discordResponse.messageId;
            response.message = `Weather checked for ${city}. Rain detected, alert sent to Discord.`;
            
            this.logger.log(
              `Successfully sent weather alert to Discord for ${city}. Message ID: ${discordResponse.messageId}`,
            );
          } else {
            response.message = `Weather checked for ${city}. Rain detected, but failed to send Discord alert.`;
            this.logger.warn(`Failed to send Discord alert for ${city}`);
          }
        } catch (discordError) {
          response.message = `Weather checked for ${city}. Rain detected, but Discord notification failed.`;
          this.logger.error(`Discord notification failed for ${city}:`, discordError.stack);
        }
      } else {
        response.message = `Weather checked for ${city}. No rain detected, no alert needed.`;
        this.logger.log(`No rain detected in ${city}, no Discord alert needed`);
      }

      return response;
    } catch (error) {
      this.logger.error(`Weather-to-Discord failed for city: ${city}`, error.stack);
      
      return {
        success: false,
        message: `Failed to check weather for ${city}: ${error.message}`,
        city,
        weatherCondition: 'Unknown',
        isRaining: false,
        messageSent: false,
      };
    }
  }

  /**
   * Execute weather-to-discord action based on AREA configuration
   * This method is designed to be called by the AREA execution engine
   * @param actionConfig Configuration for the weather check (contains city)
   * @param reactionConfig Configuration for the Discord notification (contains webhookUrl)
   * @returns Execution result
   */
  async executeArea(
    actionConfig: { city: string },
    reactionConfig: { webhookUrl: string },
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    this.logger.log(`Executing AREA: Weather check for ${actionConfig.city} -> Discord notification`);

    try {
      const result = await this.checkWeatherAndNotify(
        actionConfig.city,
        reactionConfig.webhookUrl,
      );

      return {
        success: result.success && result.isRaining && result.messageSent,
        message: result.message,
        data: result,
      };
    } catch (error) {
      this.logger.error('AREA execution failed:', error.stack);
      return {
        success: false,
        message: `AREA execution failed: ${error.message}`,
      };
    }
  }
}
