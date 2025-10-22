import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CompleteGithubDto } from './dto/complete-github.dto';

@ApiTags('connections')
@ApiBearerAuth()
@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('github/start')
  async startGithub(
    @Req() request: Request,
  ): Promise<{ authorizeUrl: string; state: string }> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    return this.connectionsService.startGithubConnection(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('github/complete')
  async completeGithub(
    @Req() request: Request,
    @Body(new ValidationPipe({ transform: true }))
    body: CompleteGithubDto,
  ): Promise<{
    success: boolean;
    provider: string;
    account: { login: string; avatarUrl?: string | null };
  }> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    const result = await this.connectionsService.completeGithubConnection(
      userId,
      body.code,
      body.state,
    );
    return {
      success: true,
      provider: 'github',
      account: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listConnections(
    @Req() request: Request,
  ): Promise<{
    connections: Array<{
      provider: string;
      connected: boolean;
      connectedAt: string | null;
    }>;
  }> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    const connections =
      await this.connectionsService.getConnectionStatuses(userId);
    return {
      connections: connections.map((connection) => ({
        provider: connection.provider,
        connected: connection.connected,
        connectedAt: connection.connectedAt ?? null,
      })),
    };
  }
}
