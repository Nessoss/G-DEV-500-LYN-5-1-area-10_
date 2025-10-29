import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { DatabaseService } from '../database/database.service';

interface GithubAuthorizeResult {
  authorizeUrl: string;
  state: string;
}

interface GithubAccessTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

interface GithubUserProfile {
  id: number;
  login: string;
  name?: string | null;
  avatar_url?: string;
}

interface StoredState {
  userId: number;
  expiresAt: number;
}

interface ConnectionStatus {
  provider: string;
  connected: boolean;
  connectedAt?: string | null;
}

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_API_URL = 'https://api.github.com/user';
const GITHUB_PROVIDER_KEY = 'github';
const SPOTIFY_PROVIDER_KEY = 'spotify';

@Injectable()
export class ConnectionsService {
  private readonly logger = new Logger(ConnectionsService.name);
  private readonly stateTtlMs = 5 * 60 * 1000; // 5 minutes
  private readonly stateStore = new Map<string, StoredState>();

  constructor(
    private readonly usersService: UsersService,
    private readonly database: DatabaseService,
  ) {}

  async startGithubConnection(userId: number): Promise<GithubAuthorizeResult> {
    const { clientId, redirectUri, scope } = this.getGithubConfiguration();

    const state = randomUUID();
    this.stateStore.set(state, {
      userId,
      expiresAt: Date.now() + this.stateTtlMs,
    });
    this.pruneExpiredStates();

    const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
    authorizeUrl.searchParams.set('client_id', clientId);
    authorizeUrl.searchParams.set('state', state);
    if (redirectUri) {
      authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    }
    authorizeUrl.searchParams.set('scope', scope);

    return {
      authorizeUrl: authorizeUrl.toString(),
      state,
    };
  }

  async completeGithubConnection(
    userId: number,
    code: string,
    state: string,
  ): Promise<{ login: string; avatarUrl?: string | null }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Utilisateur introuvable.');
    }

    const stateEntry = this.stateStore.get(state);

    if (!stateEntry) {
      throw new BadRequestException('Invalid or expired state parameter');
    }

    if (stateEntry.userId !== userId) {
      throw new BadRequestException(
        'State does not match the authenticated user',
      );
    }

    if (Date.now() > stateEntry.expiresAt) {
      this.stateStore.delete(state);
      throw new BadRequestException('State has expired, please retry.');
    }

    this.stateStore.delete(state);

    const tokens = await this.exchangeGithubCode(code);
    const profile = await this.fetchGithubProfile(tokens.access_token);

    await this.usersService.upsertProviderAccount({
      userId,
      provider: GITHUB_PROVIDER_KEY,
      providerUserId: profile.id.toString(),
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      expiresAt: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null,
    });

    this.logger.log(
      `GitHub account connected for user ${userId} (${profile.login})`,
    );

    return {
      login: profile.login,
      avatarUrl: profile.avatar_url ?? null,
    };
  }

  async getConnectionStatuses(userId: number): Promise<ConnectionStatus[]> {
    const accounts = await this.database.providerAccount.findMany({
      where: {
        userId,
      },
    });

    const githubAccount = accounts.find(
      (account) => account.provider === GITHUB_PROVIDER_KEY,
    );

    const spotifyAccount = accounts.find(
      (account) => account.provider === SPOTIFY_PROVIDER_KEY,
    );

    return [
      {
        provider: GITHUB_PROVIDER_KEY,
        connected: Boolean(githubAccount),
        connectedAt: githubAccount
          ? githubAccount.createdAt.toISOString()
          : null,
      },
      {
        provider: SPOTIFY_PROVIDER_KEY,
        connected: Boolean(spotifyAccount),
        connectedAt: spotifyAccount
          ? spotifyAccount.createdAt.toISOString()
          : null,
      },
    ];
  }

  private getGithubConfiguration(): {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string;
  } {
    const clientId =
      process.env.GITHUB_OAUTH_CLIENT_ID ??
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
    const redirectUri =
      process.env.GITHUB_OAUTH_REDIRECT_URI ??
      process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI ??
      '';
    const scope =
      process.env.GITHUB_OAUTH_SCOPE ??
      process.env.NEXT_PUBLIC_GITHUB_SCOPE ??
      'repo user';

    if (!clientId) {
      throw new InternalServerErrorException(
        'GitHub OAuth client ID is not configured.',
      );
    }

    if (!clientSecret) {
      throw new InternalServerErrorException(
        'GitHub OAuth client secret is not configured.',
      );
    }

    if (!redirectUri) {
      throw new InternalServerErrorException(
        'GitHub OAuth redirect URI is not configured.',
      );
    }

    return { clientId, clientSecret, redirectUri, scope };
  }

  private async exchangeGithubCode(
    code: string,
  ): Promise<GithubAccessTokenResponse> {
    const { clientId, clientSecret, redirectUri } =
      this.getGithubConfiguration();

    const response = await fetch(GITHUB_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(
        `GitHub token exchange failed: ${response.status} ${errorText}`,
      );
      throw new BadRequestException(
        'Impossible de finaliser la connexion GitHub.',
      );
    }

    const payload = (await response.json()) as
      | GithubAccessTokenResponse
      | { error: string; error_description?: string };

    if ('error' in payload) {
      this.logger.error(
        `GitHub token exchange returned error: ${payload.error} ${payload.error_description}`,
      );
      throw new BadRequestException(
        payload.error_description ??
          'GitHub a refusé la connexion. Veuillez réessayer.',
      );
    }

    if (!payload.access_token) {
      throw new BadRequestException(
        'GitHub a renvoyé une réponse invalide (pas de jeton).',
      );
    }

    return payload;
  }

  private async fetchGithubProfile(
    accessToken: string,
  ): Promise<GithubUserProfile> {
    const response = await fetch(GITHUB_USER_API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(
        `GitHub profile fetch failed: ${response.status} ${errorText}`,
      );
      throw new BadRequestException(
        'Impossible de récupérer votre profil GitHub.',
      );
    }

    const profile = (await response.json()) as GithubUserProfile;

    if (!profile?.id || !profile?.login) {
      throw new BadRequestException(
        'Profil GitHub incomplet. Veuillez réessayer.',
      );
    }

    return profile;
  }

  private pruneExpiredStates(): void {
    const now = Date.now();
    for (const [key, value] of this.stateStore.entries()) {
      if (value.expiresAt <= now) {
        this.stateStore.delete(key);
      }
    }
  }
}
