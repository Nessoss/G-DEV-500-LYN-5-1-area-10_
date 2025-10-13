import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WeatherToDiscordDto {
  @ApiProperty({
    description: 'Name of the city to check weather for',
    example: 'Paris',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Discord webhook URL to send the alert to',
    example: 'https://discord.com/api/webhooks/123456789/abcdefghijklmnop',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  webhookUrl: string;
}

export class WeatherToDiscordResponseDto {
  @ApiProperty({
    description: 'Whether the weather check and notification was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message describing what happened',
    example: 'Weather checked for Paris. Rain detected, alert sent to Discord.',
  })
  message: string;

  @ApiProperty({
    description: 'City that was checked',
    example: 'Paris',
  })
  city: string;

  @ApiProperty({
    description: 'Weather condition that was detected',
    example: 'Rain',
  })
  weatherCondition: string;

  @ApiProperty({
    description: 'Whether it was raining',
    example: true,
  })
  isRaining: boolean;

  @ApiProperty({
    description: 'Whether a Discord message was sent',
    example: true,
  })
  messageSent: boolean;

  @ApiProperty({
    description: 'Discord message ID (if message was sent)',
    example: '1234567890123456789',
    required: false,
  })
  discordMessageId?: string;
}
