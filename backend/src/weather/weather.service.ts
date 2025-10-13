import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherResponseDto } from './dto/weather-check.dto';
import { OpenWeatherMapResponse } from './interfaces/openweathermap.interface';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.error('OPENWEATHERMAP_API_KEY is not configured');
      throw new Error('OPENWEATHERMAP_API_KEY environment variable is required');
    }
  }

  /**
   * Check weather for a specific city
   * @param city The city name to check weather for
   * @returns Weather information including if it's raining
   */
  async checkWeather(city: string): Promise<WeatherResponseDto> {
    try {
      this.logger.log(`Checking weather for city: ${city}`);

      const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new BadRequestException(`City '${city}' not found`);
        }
        throw new BadRequestException(`Weather API error: ${response.status}`);
      }

      const weatherData: OpenWeatherMapResponse = await response.json();

      if (weatherData.cod !== 200) {
        throw new BadRequestException(`Weather API error: ${weatherData.message || 'Unknown error'}`);
      }

      const weatherCondition = weatherData.weather[0];
      const isRaining = this.isRainingCondition(weatherCondition.main);

      const result: WeatherResponseDto = {
        city: weatherData.name,
        condition: weatherCondition.main,
        description: weatherCondition.description,
        temperature: weatherData.main.temp,
        isRaining,
      };

      this.logger.log(`Weather check completed for ${city}: ${weatherCondition.main} (${weatherCondition.description})`);

      return result;
    } catch (error) {
      this.logger.error(`Failed to check weather for city: ${city}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch weather data');
    }
  }

  /**
   * Determine if the weather condition indicates rain
   * @param condition Weather condition main value
   * @returns True if it's raining
   */
  private isRainingCondition(condition: string): boolean {
    const rainyConditions = ['Rain', 'Drizzle', 'Thunderstorm'];
    return rainyConditions.includes(condition);
  }

  /**
   * Check if it's raining in a specific city
   * @param city The city name to check
   * @returns True if it's currently raining
   */
  async isRaining(city: string): Promise<boolean> {
    const weather = await this.checkWeather(city);
    return weather.isRaining;
  }
}
