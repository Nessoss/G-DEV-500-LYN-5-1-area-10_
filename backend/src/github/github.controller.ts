import { Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  GithubService,
  GithubActionKey,
  GITHUB_SUPPORTED_ACTIONS,
} from './github.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('github')
@ApiBearerAuth()
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @UseGuards(JwtAuthGuard)
  @Get('test')
  @ApiOperation({ summary: 'Test GitHub polling for a repository' })
  @ApiQuery({
    name: 'owner',
    required: true,
    description: 'GitHub organisation or user',
  })
  @ApiQuery({
    name: 'repo',
    required: true,
    description: 'Repository name',
  })
  @ApiQuery({
    name: 'action',
    required: false,
    description: 'Optional action key to filter the results',
    enum: GITHUB_SUPPORTED_ACTIONS,
  })
  async testRepository(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Query('action') action?: string,
  ): Promise<Record<string, unknown>> {
    if (!owner || !repo) {
      return { error: 'Parameters "owner" and "repo" are required' };
    }

    if (action && !GITHUB_SUPPORTED_ACTIONS.includes(action as GithubActionKey)) {
      return {
        error: `Invalid action key. Supported values: ${GITHUB_SUPPORTED_ACTIONS.join(', ')}`,
      };
    }

    const actionKey = action as GithubActionKey | undefined;
    const data = await this.githubService.manualFetch(owner, repo, actionKey);

    return {
      owner,
      repo,
      fetchedAt: new Date().toISOString(),
      result: data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('poll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger GitHub polling for all areas' })
  async triggerPolling() {
    await this.githubService.pollAllAreas();
    return { message: 'GitHub polling triggered successfully' };
  }
}
