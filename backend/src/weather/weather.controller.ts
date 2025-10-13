import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherResponseDto } from './dto/weather-check.dto';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('check')
  @ApiOperation({ summary: 'Check weather for a specific city' })
  @ApiQuery({
    name: 'city',
    description: 'Name of the city to check weather for',
    example: 'Paris',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather information retrieved successfully',
    type: WeatherResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid city name or API error',
  })
  async checkWeather(
    @Query('city', new ValidationPipe({ transform: true })) city: string,
  ): Promise<WeatherResponseDto> {
    return this.weatherService.checkWeather(city);
  }

  @Get('is-raining')
  @ApiOperation({ summary: 'Check if it is raining in a specific city' })
  @ApiQuery({
    name: 'city',
    description: 'Name of the city to check if it is raining',
    example: 'London',
  })
  @ApiResponse({
    status: 200,
    description: 'Rain status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        city: { type: 'string', example: 'London' },
        isRaining: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid city name or API error',
  })
  async isRaining(
    @Query('city', new ValidationPipe({ transform: true })) city: string,
  ): Promise<{ city: string; isRaining: boolean }> {
    const isRaining = await this.weatherService.isRaining(city);
    return { city, isRaining };
  }
}
