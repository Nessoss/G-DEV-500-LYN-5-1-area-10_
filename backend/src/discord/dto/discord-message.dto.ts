import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendDiscordMessageDto {
  @ApiProperty({
    description: 'Discord webhook URL',
    example: 'https://discord.com/api/webhooks/123456789/abcdefghijklmnop',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  webhookUrl: string;

  @ApiProperty({
    description: 'Message content to send',
    example: '🌧️ It\'s raining in Paris! Don\'t forget your umbrella!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Username to display (optional)',
    example: 'Weather Bot',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;
}

export class DiscordMessageResponseDto {
  @ApiProperty({
    description: 'Whether the message was sent successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Message sent successfully to Discord',
  })
  message: string;

  @ApiProperty({
    description: 'Discord message ID (if successful)',
    example: '1234567890123456789',
    required: false,
  })
  messageId?: string;
}
