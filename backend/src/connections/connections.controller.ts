import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CompleteGithubDto } from './dto/complete-github.dto';
import { CompleteDiscordDto } from './dto/complete-discord.dto';
import {
  ConnectionsListResponseDto,
  GithubAuthorizeResponseDto,
  GithubConnectionResponseDto,
  DiscordAuthorizeResponseDto,
  DiscordConnectionResponseDto,
  DiscordGuildListResponseDto,
  DiscordChannelListResponseDto,
} from './dto/connection-response.dto';
import { UnauthorizedResponseDto } from '../auth/dto/login-response.dto';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
} from '../common/dto/error-response.dto';

@ApiTags('connections')
@ApiBearerAuth()
@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('github/start')
  @ApiOperation({
    summary: 'Initier la connexion OAuth GitHub',
    description:
      'Génère une URL d’autorisation et un paramètre state pour connecter l’utilisateur authentifié à GitHub.',
  })
  @ApiOkResponse({
    description: 'URL d’autorisation générée avec succès',
    type: GithubAuthorizeResponseDto,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  async startGithub(
    @Req() request: Request,
  ): Promise<GithubAuthorizeResponseDto> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    return this.connectionsService.startGithubConnection(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('github/complete')
  @ApiOperation({
    summary: 'Finaliser la connexion GitHub',
    description:
      'Échange le code d’autorisation contre des jetons et enregistre le compte connecté.',
  })
  @ApiBody({ type: CompleteGithubDto })
  @ApiOkResponse({
    description: 'Compte GitHub connecté avec succès',
    type: GithubConnectionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'State invalide ou code d’autorisation refusé',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(ValidationErrorResponseDto) },
        { $ref: getSchemaPath(ErrorResponseDto) },
      ],
    },
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  async completeGithub(
    @Req() request: Request,
    @Body(new ValidationPipe({ transform: true }))
    body: CompleteGithubDto,
  ): Promise<GithubConnectionResponseDto> {
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
      account: {
        login: result.login,
        avatarUrl: result.avatarUrl ?? null,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('discord/start')
  @ApiOperation({
    summary: 'Initier la connexion OAuth Discord',
    description:
      'Génère une URL d’autorisation pour installer le bot et autoriser l’accès aux serveurs de l’utilisateur.',
  })
  @ApiOkResponse({
    description: 'URL Discord générée',
    type: DiscordAuthorizeResponseDto,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  async startDiscord(
    @Req() request: Request,
  ): Promise<DiscordAuthorizeResponseDto> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    return this.connectionsService.startDiscordConnection(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('discord/complete')
  @ApiOperation({
    summary: 'Finaliser la connexion Discord',
    description:
      'Échange le code contre un jeton utilisateur, vérifie le serveur sélectionné et enregistre la connexion.',
  })
  @ApiBody({ type: CompleteDiscordDto })
  @ApiOkResponse({
    description: 'Compte Discord connecté avec succès',
    type: DiscordConnectionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'State invalide ou code refusé par Discord',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(ValidationErrorResponseDto) },
        { $ref: getSchemaPath(ErrorResponseDto) },
      ],
    },
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  async completeDiscord(
    @Req() request: Request,
    @Body(new ValidationPipe({ transform: true }))
    body: CompleteDiscordDto,
  ): Promise<DiscordConnectionResponseDto> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    return this.connectionsService.completeDiscordConnection(
      userId,
      body.code,
      body.state,
      body.guildId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('discord/guilds')
  @ApiOperation({
    summary: 'Lister les serveurs Discord connectés',
    description:
      "Renvoie les guildes (serveurs) sur lesquels l'utilisateur a autorisé le bot.",
  })
  @ApiOkResponse({
    description: 'Liste des guildes Discord accessibles',
    type: DiscordGuildListResponseDto,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  async listDiscordGuilds(
    @Req() request: Request,
  ): Promise<DiscordGuildListResponseDto> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    const guilds = await this.connectionsService.listDiscordGuilds(userId);
    return { guilds };
  }

  @UseGuards(JwtAuthGuard)
  @Get('discord/guilds/:guildId/channels')
  @ApiOperation({
    summary: 'Lister les canaux Discord d’un serveur',
    description:
      'Renvoie les canaux textuels où le bot peut écrire ou réagir pour le serveur sélectionné.',
  })
  @ApiOkResponse({
    description: 'Canaux Discord disponibles',
    type: DiscordChannelListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Serveur Discord inconnu ou non autorisé',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(ValidationErrorResponseDto) },
        { $ref: getSchemaPath(ErrorResponseDto) },
      ],
    },
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  async listDiscordChannels(
    @Req() request: Request,
    @Param('guildId') guildId: string,
  ): Promise<DiscordChannelListResponseDto> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    const channels = await this.connectionsService.listDiscordChannels(
      userId,
      guildId,
    );
    return { channels };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Lister les fournisseurs externes connectés par l’utilisateur',
  })
  @ApiOkResponse({
    description: 'Statut de connexion actuel pour chaque fournisseur',
    type: ConnectionsListResponseDto,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseDto })
  async listConnections(
    @Req() request: Request,
  ): Promise<ConnectionsListResponseDto> {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    const connections =
      await this.connectionsService.getConnectionStatuses(userId);
    return {
      connections: connections.map((connection) => ({
        provider: connection.provider,
        connected: connection.connected,
        connectedAt: connection.connectedAt ?? null,
        details: connection.details ?? null,
      })),
    };
  }
}
