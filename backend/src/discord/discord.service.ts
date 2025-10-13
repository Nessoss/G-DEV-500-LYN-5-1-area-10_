import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DiscordMessageResponseDto } from './dto/discord-message.dto';
import { 
  DiscordWebhookPayload, 
  DiscordWebhookResponse,
  DiscordEmbed 
} from './interfaces/discord-webhook.interface';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  /**
   * Send a message to Discord via webhook
   * @param webhookUrl Discord webhook URL
   * @param content Message content
   * @param username Optional username to display
   * @returns Response indicating success/failure
   */
  async sendMessage(
    webhookUrl: string,
    content: string,
    username?: string,
  ): Promise<DiscordMessageResponseDto> {
    try {
      this.logger.log(`Sending message to Discord webhook`);

      // Validate webhook URL format
      if (!this.isValidDiscordWebhookUrl(webhookUrl)) {
        throw new BadRequestException('Invalid Discord webhook URL format');
      }

      const payload: DiscordWebhookPayload = {
        content: content.slice(0, 2000), // Discord message limit
        username: username || 'Weather Bot',
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Discord webhook failed: ${response.status} - ${errorText}`);
        throw new BadRequestException(`Failed to send Discord message: ${response.status}`);
      }

      const responseData: DiscordWebhookResponse = await response.json();

      this.logger.log(`Message sent successfully to Discord. Message ID: ${responseData.id}`);

      return {
        success: true,
        message: 'Message sent successfully to Discord',
        messageId: responseData.id,
      };
    } catch (error) {
      this.logger.error('Failed to send Discord message', error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to send message to Discord');
    }
  }

  /**
   * Send a rich embed message to Discord
   * @param webhookUrl Discord webhook URL
   * @param embed Embed content
   * @param username Optional username to display
   * @returns Response indicating success/failure
   */
  async sendEmbed(
    webhookUrl: string,
    embed: DiscordEmbed,
    username?: string,
  ): Promise<DiscordMessageResponseDto> {
    try {
      this.logger.log(`Sending embed message to Discord webhook`);

      if (!this.isValidDiscordWebhookUrl(webhookUrl)) {
        throw new BadRequestException('Invalid Discord webhook URL format');
      }

      const payload: DiscordWebhookPayload = {
        content: '',
        username: username || 'Weather Bot',
        embeds: [embed],
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Discord webhook failed: ${response.status} - ${errorText}`);
        throw new BadRequestException(`Failed to send Discord embed: ${response.status}`);
      }

      const responseData: DiscordWebhookResponse = await response.json();

      this.logger.log(`Embed sent successfully to Discord. Message ID: ${responseData.id}`);

      return {
        success: true,
        message: 'Embed sent successfully to Discord',
        messageId: responseData.id,
      };
    } catch (error) {
      this.logger.error('Failed to send Discord embed', error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to send embed to Discord');
    }
  }

  /**
   * Send a weather alert message to Discord
   * @param webhookUrl Discord webhook URL
   * @param city City name
   * @param weatherCondition Weather condition
   * @param temperature Temperature in Celsius
   * @returns Response indicating success/failure
   */
  async sendWeatherAlert(
    webhookUrl: string,
    city: string,
    weatherCondition: string,
    temperature: number,
  ): Promise<DiscordMessageResponseDto> {
    const embed: DiscordEmbed = {
      title: `🌧️ Weather Alert for ${city}`,
      description: `It's currently raining in ${city}!`,
      color: 0x3498db, // Blue color
      fields: [
        {
          name: '🌦️ Condition',
          value: weatherCondition,
          inline: true,
        },
        {
          name: '🌡️ Temperature',
          value: `${temperature.toFixed(1)}°C`,
          inline: true,
        },
        {
          name: '💡 Tip',
          value: "Don't forget your umbrella!",
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    return this.sendEmbed(webhookUrl, embed);
  }

  /**
   * Validate if a URL is a valid Discord webhook URL
   * @param url URL to validate
   * @returns True if valid Discord webhook URL
   */
  private isValidDiscordWebhookUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.hostname === 'discord.com' ||
        parsedUrl.hostname === 'discordapp.com'
      ) && parsedUrl.pathname.includes('/api/webhooks/');
    } catch {
      return false;
    }
  }
}
