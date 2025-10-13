import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DiscordService } from './discord.service';
import { SendDiscordMessageDto, DiscordMessageResponseDto } from './dto/discord-message.dto';

@ApiTags('discord')
@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post('send-message')
  @ApiOperation({ summary: 'Send a message to Discord via webhook' })
  @ApiBody({ type: SendDiscordMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully to Discord',
    type: DiscordMessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid webhook URL or message content',
  })
  async sendMessage(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    sendMessageDto: SendDiscordMessageDto,
  ): Promise<DiscordMessageResponseDto> {
    return this.discordService.sendMessage(
      sendMessageDto.webhookUrl,
      sendMessageDto.content,
      sendMessageDto.username,
    );
  }

  @Post('send-weather-alert')
  @ApiOperation({ summary: 'Send a weather alert to Discord' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        webhookUrl: {
          type: 'string',
          format: 'url',
          description: 'Discord webhook URL',
          example: 'https://discord.com/api/webhooks/123456789/abcdefghijklmnop',
        },
        city: {
          type: 'string',
          description: 'City name',
          example: 'Paris',
        },
        weatherCondition: {
          type: 'string',
          description: 'Weather condition',
          example: 'Rain',
        },
        temperature: {
          type: 'number',
          description: 'Temperature in Celsius',
          example: 15.5,
        },
      },
      required: ['webhookUrl', 'city', 'weatherCondition', 'temperature'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Weather alert sent successfully to Discord',
    type: DiscordMessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid webhook URL or weather data',
  })
  async sendWeatherAlert(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    alertData: {
      webhookUrl: string;
      city: string;
      weatherCondition: string;
      temperature: number;
    },
  ): Promise<DiscordMessageResponseDto> {
    return this.discordService.sendWeatherAlert(
      alertData.webhookUrl,
      alertData.city,
      alertData.weatherCondition,
      alertData.temperature,
    );
  }
}
