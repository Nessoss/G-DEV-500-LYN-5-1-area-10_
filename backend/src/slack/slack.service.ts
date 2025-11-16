import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private readonly client: WebClient | null;

  constructor(private readonly config: ConfigService) {
    const token = this.config.get<string>('SLACK_BOT_TOKEN') ?? process.env.SLACK_BOT_TOKEN;
    if (!token) {
      this.logger.warn('SLACK_BOT_TOKEN not set; SlackService will be a no-op');
      this.client = null;
    } else {
      this.client = new WebClient(token);
    }
  }

  private ensureClient(): WebClient {
    if (!this.client) {
      throw new Error('Slack client not configured (missing SLACK_BOT_TOKEN)');
    }
    return this.client;
  }

  async createChannel(name: string, isPrivate = false, purpose = ''): Promise<{ id: string; name: string } | null> {
    if (!this.client) return null;
    // retry logic: attempt up to 3 times with small backoff
    const sanitized = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 80);
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await this.ensureClient().conversations.create({
          name: sanitized,
          is_private: isPrivate,
        } as any);

        if (!res.ok) {
          this.logger.warn(`Slack conversations.create failed (attempt ${attempt}): ${res.error}`);
          // if permanent error (name_taken), break early
          if (res.error === 'name_taken') {
            // try to find channel by name? For now return null
            return null;
          }
        } else {
          const channel = res.channel as any;
          if (purpose && channel?.id) {
            try {
              await this.ensureClient().conversations.setPurpose({ channel: channel.id, purpose });
            } catch (e) {
              this.logger.warn('Failed to set channel purpose: ' + ((e as Error).message ?? e));
            }
          }
          return { id: channel.id, name: channel.name };
        }
      } catch (e) {
        this.logger.warn(`createChannel error (attempt ${attempt}): ${((e as Error).message ?? e)}`);
      }

      // backoff before next attempt
      if (attempt < maxAttempts) {
        // simple delay
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }

    return null;
  }

  async inviteUsers(channelId: string, userIds: string[]): Promise<boolean> {
    if (!this.client) return false;
    try {
      // Slack API accepts up to 1000 users but will error on invalid ids
      await this.ensureClient().conversations.invite({ channel: channelId, users: userIds.join(',') } as any);
      return true;
    } catch (e) {
      this.logger.warn('inviteUsers error: ' + (e as Error).message);
      return false;
    }
  }

  async postMessage(channelId: string, text: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const res = await this.ensureClient().chat.postMessage({ channel: channelId, text } as any);
      return !!res.ok;
    } catch (e) {
      this.logger.warn('postMessage error: ' + (e as Error).message);
      return false;
    }
  }
}
