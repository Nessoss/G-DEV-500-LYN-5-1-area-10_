import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LetterboxdService } from './letterboxd.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('letterboxd')
@ApiBearerAuth()
@Controller('letterboxd')
export class LetterboxdController {
  constructor(private readonly letterboxdService: LetterboxdService) {}

  /**
   * Test endpoint to manually fetch a user's Letterboxd activity
   */
  @UseGuards(JwtAuthGuard)
  @Get('test')
  @ApiOperation({ summary: 'Test Letterboxd RSS feed for a user' })
  @ApiQuery({
    name: 'username',
    required: true,
    description: 'Letterboxd username to fetch',
  })
  async testFeed(@Query('username') username: string) {
    if (!username) {
      return { error: 'Username is required' };
    }

    const activities = await this.letterboxdService.manualPoll(username);

    return {
      username,
      count: activities.length,
      activities: activities.slice(0, 10), // Return first 10 for testing
    };
  }

  /**
   * Manually trigger polling (for testing/debugging)
   */
  @UseGuards(JwtAuthGuard)
  @Post('poll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger RSS polling for all areas' })
  async triggerPoll() {
    await this.letterboxdService.pollAllUserFeeds();
    return { message: 'Polling triggered successfully' };
  }
}
