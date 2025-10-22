import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AreaLogStatus } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

export type GithubActionKey =
  | 'new_issue'
  | 'new_pull_request'
  | 'new_release';

interface GithubAreaConfig {
  owner?: string;
  repo?: string;
  [key: string]: unknown;
}

interface GithubActivity {
  dedupKey: string;
  actionKey: GithubActionKey;
  type: 'issue' | 'pull_request' | 'release';
  owner: string;
  repo: string;
  title: string;
  url: string;
  createdAt: Date;
  author?: string;
  number?: number;
  body?: string | null;
  extra?: Record<string, unknown>;
}

interface GithubIssue {
  id: number;
  node_id: string;
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  user?: {
    login: string;
  };
  body?: string | null;
  labels?: Array<
    | string
    | {
        name?: string;
      }
  >;
  pull_request?: unknown;
}

interface GithubPullRequest {
  id: number;
  number: number;
  html_url: string;
  title: string;
  created_at: string;
  user?: {
    login: string;
  };
  body?: string | null;
  base?: {
    ref?: string;
  };
  head?: {
    ref?: string;
  };
  draft?: boolean;
  state?: string;
}

interface GithubRelease {
  id: number;
  html_url: string | null;
  tag_name: string;
  name: string | null;
  created_at: string | null;
  published_at: string | null;
  body?: string | null;
  author?: {
    login: string;
  };
  draft?: boolean;
  prerelease?: boolean;
}

export const GITHUB_SUPPORTED_ACTIONS: GithubActionKey[] = [
  'new_issue',
  'new_pull_request',
  'new_release',
];

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly apiBaseUrl = 'https://api.github.com';
  private readonly githubToken = process.env.GITHUB_TOKEN;

  constructor(private readonly database: DatabaseService) {}

  /**
   * Poll every 5 minutes for GitHub activity.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async pollAllAreas(): Promise<void> {
    this.logger.log('Starting GitHub polling...');

    try {
      const service = await this.database.service.findUnique({
        where: { slug: 'github' },
        include: { actions: true },
      });

      if (!service) {
        this.logger.warn('GitHub service not found in database');
        return;
      }

      const areas = await this.database.area.findMany({
        where: {
          enabled: true,
          action: {
            serviceId: service.id,
          },
        },
        include: {
          action: true,
          reaction: {
            include: {
              service: true,
            },
          },
          user: true,
        },
      });

      if (areas.length === 0) {
        this.logger.debug('No active GitHub areas found');
        return;
      }

      const areasByRepo = new Map<
        string,
        {
          owner: string;
          repo: string;
          actionAreas: Map<GithubActionKey, typeof areas>;
        }
      >();

      for (const area of areas) {
        const config = this.parseConfig(area.actionConfig);
        if (!config) {
          this.logger.warn(
            `Area ${area.id} is missing owner/repo configuration`,
          );
          continue;
        }

        const actionKey = area.action.key;
        if (!this.isSupportedAction(actionKey)) {
          this.logger.warn(`Unsupported GitHub action key: ${actionKey}`);
          continue;
        }

        const repoKey = `${config.owner}/${config.repo}`.toLowerCase();
        if (!areasByRepo.has(repoKey)) {
          areasByRepo.set(repoKey, {
            owner: config.owner,
            repo: config.repo,
            actionAreas: new Map(),
          });
        }

        const entry = areasByRepo.get(repoKey)!;
        if (!entry.actionAreas.has(actionKey)) {
          entry.actionAreas.set(actionKey, []);
        }

        entry.actionAreas.get(actionKey)!.push(area);
      }

      for (const repoEntry of areasByRepo.values()) {
        await this.processRepository(
          repoEntry.owner,
          repoEntry.repo,
          repoEntry.actionAreas,
          service.id,
        );
      }

      this.logger.log('GitHub polling completed');
    } catch (error) {
      this.logger.error(`GitHub polling failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Manual fetch for testing purposes.
   */
  async manualFetch(
    owner: string,
    repo: string,
    actionKey?: GithubActionKey,
  ): Promise<Record<string, GithubActivity[]>> {
    if (actionKey) {
      const activities = await this.fetchActivities(owner, repo, actionKey);
      return {
        [actionKey]: activities,
      };
    }

    const [issues, pullRequests, releases] = await Promise.all([
      this.fetchActivities(owner, repo, 'new_issue'),
      this.fetchActivities(owner, repo, 'new_pull_request'),
      this.fetchActivities(owner, repo, 'new_release'),
    ]);

    return {
      new_issue: issues,
      new_pull_request: pullRequests,
      new_release: releases,
    };
  }

  private parseConfig(config: unknown): { owner: string; repo: string } | null {
    if (!config || typeof config !== 'object') {
      return null;
    }

    const typed = config as GithubAreaConfig;
    if (!typed.owner || !typed.repo) {
      return null;
    }

    return {
      owner: String(typed.owner),
      repo: String(typed.repo),
    };
  }

  private isSupportedAction(key: string): key is GithubActionKey {
    return GITHUB_SUPPORTED_ACTIONS.includes(key as GithubActionKey);
  }

  private async processRepository(
    owner: string,
    repo: string,
    actionAreas: Map<GithubActionKey, any[]>,
    serviceId: number,
  ): Promise<void> {
    this.logger.debug(`Processing GitHub repository ${owner}/${repo}`);

    const cache = new Map<GithubActionKey, GithubActivity[]>();

    const getActivities = async (
      actionKey: GithubActionKey,
    ): Promise<GithubActivity[]> => {
      if (!cache.has(actionKey)) {
        const activities = await this.fetchActivities(owner, repo, actionKey);
        cache.set(actionKey, activities);
      }
      return cache.get(actionKey)!;
    };

    for (const [actionKey, areas] of actionAreas.entries()) {
      const activities = await getActivities(actionKey);

      for (const activity of activities) {
        const existingEvent = await this.database.webhookEvent.findUnique({
          where: {
            serviceId_externalId: {
              serviceId,
              externalId: activity.dedupKey,
            },
          },
        });

        if (existingEvent) {
          continue;
        }

        await this.database.webhookEvent.create({
          data: {
            serviceId,
            externalId: activity.dedupKey,
            payload: activity as any,
          },
        });

        for (const area of areas) {
          const config = this.parseConfig(area.actionConfig);
          if (!config) {
            continue;
          }

          const matches = this.matchesActionCriteria(
            activity,
            area.action.key as GithubActionKey,
            area.actionConfig as GithubAreaConfig,
          );

          if (!matches) {
            continue;
          }

          try {
            await this.executeReaction(area, activity);
            await this.database.areaLog.create({
              data: {
                areaId: area.id,
                status: AreaLogStatus.success,
                payload: activity as any,
              },
            });
          } catch (error) {
            this.logger.error(
              `Failed to execute reaction for area ${area.id}: ${error.message}`,
            );

            await this.database.areaLog.create({
              data: {
                areaId: area.id,
                status: AreaLogStatus.failure,
                payload: activity as any,
                error: error.message,
              },
            });
          }
        }
      }
    }
  }

  private matchesActionCriteria(
    activity: GithubActivity,
    actionKey: GithubActionKey,
    config: GithubAreaConfig,
  ): boolean {
    switch (actionKey) {
      case 'new_issue':
      case 'new_pull_request':
      case 'new_release':
        // Future filters (labels, branches, etc.) can be added here.
        return true;
      default:
        return false;
    }
  }

  private async executeReaction(area: any, activity: GithubActivity) {
    const reactionConfig = area.reactionConfig || {};

    switch (area.reaction.key) {
      case 'send_webhook':
        await this.sendWebhook(reactionConfig, activity);
        break;
      case 'log_activity':
        this.logActivity(reactionConfig, activity);
        break;
      default:
        this.logger.warn(`Unknown reaction type: ${area.reaction.key}`);
    }
  }

  private async sendWebhook(
    config: any,
    activity: GithubActivity,
  ): Promise<void> {
    if (!config?.webhookUrl) {
      throw new Error('Webhook URL is required');
    }

    const isDiscordWebhook =
      typeof config.webhookUrl === 'string' &&
      config.webhookUrl.includes('discord') &&
      config.webhookUrl.includes('/api/webhooks');

    let payload: any;

    if (isDiscordWebhook) {
      const color =
        activity.type === 'issue'
          ? 0x0969da
          : activity.type === 'pull_request'
          ? 0x58a6ff
          : 0x2ea043;

      const description =
        config.includeBody === false || !activity.body
          ? undefined
          : this.truncate(activity.body, 1024);

      const fields: Array<{ name: string; value: string; inline?: boolean }> = [
        {
          name: '📁 Repository',
          value: `${activity.owner}/${activity.repo}`,
          inline: true,
        },
        {
          name: '👤 Auteur',
          value: activity.author ?? 'Inconnu',
          inline: true,
        },
      ];

      if (activity.number !== undefined) {
        fields.push({
          name: '🔢 Numéro',
          value: `#${activity.number}`,
          inline: true,
        });
      }

      if (activity.extra?.tag) {
        fields.push({
          name: '🏷️ Tag',
          value: String(activity.extra.tag),
          inline: true,
        });
      }

      if (activity.extra?.draft !== undefined) {
        fields.push({
          name: '📝 Brouillon',
          value: activity.extra.draft ? 'Oui' : 'Non',
          inline: true,
        });
      }

      payload = {
        username: 'GitHub Bot',
        avatar_url:
          'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        embeds: [
          {
            title:
              activity.type === 'issue'
                ? 'Nouvelle issue'
                : activity.type === 'pull_request'
                ? 'Nouvelle pull request'
                : 'Nouvelle release',
            url: activity.url,
            description,
            color,
            fields,
            footer: {
              text: `GitHub · ${activity.actionKey}`,
              icon_url:
                'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            },
            timestamp: activity.createdAt.toISOString(),
          },
        ],
      };
    } else {
      payload = {
        repository: `${activity.owner}/${activity.repo}`,
        type: activity.type,
        actionKey: activity.actionKey,
        title: activity.title,
        url: activity.url,
        createdAt: activity.createdAt.toISOString(),
        author: activity.author,
        number: activity.number,
        body: config.includeBody === false ? undefined : activity.body,
        metadata: activity.extra,
      };
    }

    try {
      this.logger.debug(
        `Sending GitHub webhook payload: ${JSON.stringify(payload, null, 2)}`,
      );

      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Webhook returned status ${response.status}: ${errorText}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send webhook: ${error.message}`);
      throw error;
    }
  }

  private logActivity(config: any, activity: GithubActivity) {
    const logLevel = config?.logLevel ?? 'info';
    const message = `GitHub ${activity.type} ${activity.number ? `#${activity.number}` : ''} in ${activity.owner}/${activity.repo}: ${activity.title}`;

    switch (logLevel) {
      case 'debug':
        this.logger.debug(message);
        break;
      case 'verbose':
        this.logger.verbose(message);
        break;
      default:
        this.logger.log(message);
    }
  }

  private truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value;
    }
    return `${value.slice(0, maxLength - 3)}...`;
  }

  private async fetchActivities(
    owner: string,
    repo: string,
    actionKey: GithubActionKey,
  ): Promise<GithubActivity[]> {
    switch (actionKey) {
      case 'new_issue':
        return this.fetchIssues(owner, repo);
      case 'new_pull_request':
        return this.fetchPullRequests(owner, repo);
      case 'new_release':
        return this.fetchReleases(owner, repo);
      default:
        return [];
    }
  }

  private async fetchIssues(
    owner: string,
    repo: string,
  ): Promise<GithubActivity[]> {
    const url = `${this.apiBaseUrl}/repos/${owner}/${repo}/issues?state=open&sort=created&direction=desc&per_page=20`;
    const items = await this.fetchFromGithub<GithubIssue[]>(url, 'issues list');

    if (!items) {
      return [];
    }

    return items
      .filter((item) => !item.pull_request)
      .map((item) => ({
        dedupKey: `github:${owner}/${repo}:issue:${item.id}`,
        actionKey: 'new_issue' as const,
        type: 'issue' as const,
        owner,
        repo,
        title: item.title,
        url: item.html_url,
        createdAt: new Date(item.created_at),
        author: item.user?.login,
        number: item.number,
        body: item.body ?? null,
        extra: {
          labels: (item.labels ?? []).map((label) =>
            typeof label === 'string' ? label : label?.name,
          ),
        },
      }));
  }

  private async fetchPullRequests(
    owner: string,
    repo: string,
  ): Promise<GithubActivity[]> {
    const url = `${this.apiBaseUrl}/repos/${owner}/${repo}/pulls?state=open&sort=created&direction=desc&per_page=20`;
    const items = await this.fetchFromGithub<GithubPullRequest[]>(
      url,
      'pull requests list',
    );

    if (!items) {
      return [];
    }

    return items.map((item) => ({
      dedupKey: `github:${owner}/${repo}:pull:${item.id}`,
      actionKey: 'new_pull_request' as const,
      type: 'pull_request' as const,
      owner,
      repo,
      title: item.title,
      url: item.html_url,
      createdAt: new Date(item.created_at),
      author: item.user?.login,
      number: item.number,
      body: item.body ?? null,
      extra: {
        base: item.base?.ref,
        head: item.head?.ref,
        draft: item.draft ?? false,
        state: item.state,
      },
    }));
  }

  private async fetchReleases(
    owner: string,
    repo: string,
  ): Promise<GithubActivity[]> {
    const url = `${this.apiBaseUrl}/repos/${owner}/${repo}/releases?per_page=20`;
    const items = await this.fetchFromGithub<GithubRelease[]>(
      url,
      'releases list',
    );

    if (!items) {
      return [];
    }

    return items.map((item) => ({
      dedupKey: `github:${owner}/${repo}:release:${item.id}`,
      actionKey: 'new_release' as const,
      type: 'release' as const,
      owner,
      repo,
      title: item.name || item.tag_name,
      url:
        item.html_url ??
        `https://github.com/${owner}/${repo}/releases/tag/${encodeURIComponent(item.tag_name)}`,
      createdAt: new Date(item.published_at || item.created_at || Date.now()),
      author: item.author?.login,
      number: undefined,
      body: item.body ?? null,
      extra: {
        tag: item.tag_name,
        draft: item.draft ?? false,
        prerelease: item.prerelease ?? false,
      },
    }));
  }

  private async fetchFromGithub<T>(
    url: string,
    context: string,
  ): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'area-backend',
      };

      if (this.githubToken) {
        headers.Authorization = `Bearer ${this.githubToken}`;
      }

      this.logger.debug(`GitHub request (${context}): ${url}`);

      const response = await fetch(url, { headers });
      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `GitHub API error for ${context}: ${response.status} ${response.statusText} - ${errorText}`,
        );
        return null;
      }

      return (await response.json()) as T;
    } catch (error) {
      this.logger.error(
        `GitHub API request failed for ${context}: ${error.message}`,
      );
      return null;
    }
  }
}
