import { Body, Controller, Post, Req, Res, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Controller('slack')
export class SlackController {
  private readonly logger = new Logger(SlackController.name);

  constructor(private readonly config: ConfigService) {}

  // Slack Events API endpoint
  @Post('events')
  async events(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    const signingSecret = this.config.get<string>('SLACK_SIGNING_SECRET') ?? process.env.SLACK_SIGNING_SECRET;
    const timestamp = req.headers['x-slack-request-timestamp'] as string | undefined;
    const sig = req.headers['x-slack-signature'] as string | undefined;

    if (!signingSecret) {
      this.logger.warn('SLACK_SIGNING_SECRET not configured — rejecting event');
      return res.status(403).send('Signing secret not configured');
    }

    if (!timestamp || !sig) {
      this.logger.warn('Missing Slack signature headers');
      return res.status(400).send('Bad Request');
    }

    // prevent replay attacks (allow 5 minutes)
    const ts = parseInt(timestamp, 10);
    if (Math.abs(Date.now() / 1000 - ts) > 60 * 5) {
      this.logger.warn('Slack request timestamp outside acceptable range');
      return res.status(400).send('Stale request');
    }

    const rawBody = (req as any).rawBody ?? JSON.stringify(body);
    const basestring = `v0:${timestamp}:${rawBody}`;
    const hmac = crypto.createHmac('sha256', signingSecret).update(basestring).digest('hex');
    const computed = `v0=${hmac}`;

    if (!crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(sig))) {
      this.logger.warn('Slack signature verification failed');
      return res.status(403).send('Invalid signature');
    }

    // URL verification challenge
    if (body && body.type === 'url_verification') {
      return res.status(200).json({ challenge: body.challenge });
    }

    // For events we currently just ack; further processing can be added later
    this.logger.debug(`Received Slack event: ${JSON.stringify(body).slice(0, 2000)}`);
    return res.status(200).send();
  }
}
