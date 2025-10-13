import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { WeatherToDiscordService } from './weather-to-discord.service';
import {
  WeatherToDiscordDto,
  WeatherToDiscordResponseDto,
} from './dto/weather-to-discord.dto';

@ApiTags('weather-to-discord')
@Controller('weather-to-discord')
export class WeatherToDiscordController {
  constructor(
    private readonly weatherToDiscordService: WeatherToDiscordService,
  ) {}

  @Post('check-and-notify')
  @ApiOperation({
    summary: 'Check weather for a city and send Discord alert if raining',
    description:
      'This endpoint checks the weather for a specified city and sends a Discord webhook notification if it is currently raining.',
  })
  @ApiBody({ type: WeatherToDiscordDto })
  @ApiResponse({
    status: 201,
    description: 'Weather check completed and notification sent if needed',
    type: WeatherToDiscordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid city name or webhook URL',
  })
  async checkWeatherAndNotify(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    weatherToDiscordDto: WeatherToDiscordDto,
  ): Promise<WeatherToDiscordResponseDto> {
    return this.weatherToDiscordService.checkWeatherAndNotify(
      weatherToDiscordDto.city,
      weatherToDiscordDto.webhookUrl,
    );
  }

  @Post('execute-area')
  @ApiOperation({
    summary: 'Execute weather-to-discord AREA',
    description:
      'Execute the weather-to-discord AREA with the provided action and reaction configurations.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        actionConfig: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description: 'City name to check weather for',
              example: 'Paris',
            },
          },
          required: ['city'],
        },
        reactionConfig: {
          type: 'object',
          properties: {
            webhookUrl: {
              type: 'string',
              format: 'url',
              description: 'Discord webhook URL',
              example: 'https://discord.com/api/webhooks/123456789/abcdefghijklmnop',
            },
          },
          required: ['webhookUrl'],
        },
      },
      required: ['actionConfig', 'reactionConfig'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'AREA executed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'AREA executed successfully' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid configuration',
  })
  async executeArea(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    areaConfig: {
      actionConfig: { city: string };
      reactionConfig: { webhookUrl: string };
    },
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    return this.weatherToDiscordService.executeArea(
      areaConfig.actionConfig,
      areaConfig.reactionConfig,
    );
  }
}
