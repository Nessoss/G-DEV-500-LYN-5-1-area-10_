import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function toJsonValue(value: Record<string, unknown> | null) {
  if (value === null) {
    return Prisma.JsonNull;
  }
  return value as Prisma.InputJsonValue;
}

type SeedAction = {
  key: string;
  description: string;
  configSchema: Record<string, unknown> | null;
};

type SeedReaction = {
  key: string;
  description: string;
  configSchema: Record<string, unknown> | null;
};

type ServiceSeed = {
  slug: string;
  name: string;
  actions: SeedAction[];
  reactions: SeedReaction[];
};

const serviceSeeds: ServiceSeed[] = [
  {
    slug: 'letterboxd',
    name: 'Letterboxd',
    actions: [
      {
        key: 'new_review',
        description: 'Triggered when a new review is posted on Letterboxd',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: 'Letterboxd username to monitor',
            },
          },
        },
      },
      {
        key: 'new_diary_entry',
        description: 'Triggered when a new film is logged in the diary',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: 'Letterboxd username to monitor',
            },
          },
        },
      },
      {
        key: 'film_watched',
        description: 'Triggered when a film is marked as watched',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: 'Letterboxd username to monitor',
            },
          },
        },
      },
      {
        key: 'new_list',
        description: 'Triggered when a new list is created',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: 'Letterboxd username to monitor',
            },
          },
        },
      },
      {
        key: 'film_rated',
        description: 'Triggered when a film is rated (1-5 stars)',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: 'Letterboxd username to monitor',
            },
            minRating: {
              type: 'number',
              description: 'Minimum rating to trigger (optional)',
              minimum: 0,
              maximum: 5,
            },
          },
        },
      },
    ],
    reactions: [
      {
        key: 'send_webhook',
        description: 'Send film details to a webhook URL',
        configSchema: {
          type: 'object',
          required: ['webhookUrl'],
          properties: {
            webhookUrl: {
              type: 'string',
              format: 'uri',
              description: 'Webhook URL to send the film data',
            },
            includeReview: {
              type: 'boolean',
              description: 'Include review text in payload',
              default: true,
            },
          },
        },
      },
      {
        key: 'log_activity',
        description: 'Log the Letterboxd activity to console/logs',
        configSchema: {
          type: 'object',
          properties: {
            logLevel: {
              type: 'string',
              enum: ['info', 'debug', 'verbose'],
              default: 'info',
              description: 'Log level for the activity',
            },
          },
        },
      },
    ],
  },
  {
    slug: 'github',
    name: 'GitHub',
    actions: [
      {
        key: 'new_issue',
        description: 'Triggered when a new issue is opened on a repository',
        configSchema: {
          type: 'object',
          required: ['owner', 'repo'],
          properties: {
            owner: {
              type: 'string',
              description: 'GitHub organisation or username',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
          },
        },
      },
      {
        key: 'new_pull_request',
        description: 'Triggered when a new pull request is opened on a repository',
        configSchema: {
          type: 'object',
          required: ['owner', 'repo'],
          properties: {
            owner: {
              type: 'string',
              description: 'GitHub organisation or username',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
          },
        },
      },
      {
        key: 'new_release',
        description: 'Triggered when a new release is published',
        configSchema: {
          type: 'object',
          required: ['owner', 'repo'],
          properties: {
            owner: {
              type: 'string',
              description: 'GitHub organisation or username',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
          },
        },
      },
    ],
    reactions: [
      {
        key: 'send_webhook',
        description: 'Send GitHub activity details to a webhook URL',
        configSchema: {
          type: 'object',
          required: ['webhookUrl'],
          properties: {
            webhookUrl: {
              type: 'string',
              format: 'uri',
              description: 'Webhook URL to send the GitHub data',
            },
            includeBody: {
              type: 'boolean',
              description: 'Include issue/PR/release body in payload',
              default: true,
            },
          },
        },
      },
      {
        key: 'log_activity',
        description: 'Log GitHub activity to console/logs',
        configSchema: {
          type: 'object',
          properties: {
            logLevel: {
              type: 'string',
              enum: ['info', 'debug', 'verbose'],
              default: 'info',
              description: 'Log level for the activity',
            },
          },
        },
      },
    ],
  },
  {
    slug: 'spotify',
    name: 'Spotify',
    actions: [
      {
        key: 'new_liked_song',
        description: 'Triggered when a new song is liked/saved',
        configSchema: {
          type: 'object',
          properties: {
            artistFilter: {
              type: 'string',
              description: 'Filter by artist name (optional)',
            },
            genreFilter: {
              type: 'string',
              description: 'Filter by genre (optional)',
            },
          },
        },
      },
      {
        key: 'new_playlist_track',
        description: 'Triggered when a track is added to a specific playlist',
        configSchema: {
          type: 'object',
          required: ['playlistId'],
          properties: {
            playlistId: {
              type: 'string',
              description: 'Spotify playlist ID to monitor',
            },
          },
        },
      },
      {
        key: 'now_playing_changed',
        description: 'Triggered when the currently playing track changes',
        configSchema: {
          type: 'object',
          properties: {
            artistFilter: {
              type: 'string',
              description: 'Filter by artist name (optional)',
            },
          },
        },
      },
      {
        key: 'new_top_artist',
        description: 'Triggered when a new artist appears in top artists',
        configSchema: {
          type: 'object',
          properties: {
            timeRange: {
              type: 'string',
              enum: ['short_term', 'medium_term', 'long_term'],
              default: 'short_term',
              description: 'Time range for top artists',
            },
          },
        },
      },
      {
        key: 'new_playlist_created',
        description: 'Triggered when a new playlist is created',
        configSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
    reactions: [
      {
        key: 'add_to_playlist',
        description: 'Add a track to a specific playlist',
        configSchema: {
          type: 'object',
          required: ['playlistId'],
          properties: {
            playlistId: {
              type: 'string',
              description: 'Spotify playlist ID to add tracks to',
            },
          },
        },
      },
      {
        key: 'like_song',
        description: 'Like/save the current track',
        configSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        key: 'create_playlist',
        description: 'Create a new playlist',
        configSchema: {
          type: 'object',
          required: ['playlistName'],
          properties: {
            playlistName: {
              type: 'string',
              description: 'Name for the new playlist',
            },
            description: {
              type: 'string',
              description: 'Description for the new playlist',
            },
            public: {
              type: 'boolean',
              default: false,
              description: 'Make the playlist public',
            },
          },
        },
      },
      {
        key: 'follow_artist',
        description: 'Follow an artist',
        configSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        key: 'send_webhook',
        description: 'Send Spotify activity details to a webhook URL',
        configSchema: {
          type: 'object',
          required: ['webhookUrl'],
          properties: {
            webhookUrl: {
              type: 'string',
              format: 'uri',
              description: 'Webhook URL to send the Spotify data',
            },
            includeAlbum: {
              type: 'boolean',
              description: 'Include album information in payload',
              default: true,
            },
          },
        },
      },
    ],
  },
];

async function ensureService(seed: ServiceSeed): Promise<void> {
  const service = await prisma.service.upsert({
    where: { slug: seed.slug },
    update: {
      name: seed.name,
      enabled: true,
    },
    create: {
      slug: seed.slug,
      name: seed.name,
      enabled: true,
    },
  });

  console.log(`✅ Ensured service: ${seed.name}`);

  for (const action of seed.actions) {
    await prisma.action.upsert({
      where: {
        serviceId_key: {
          serviceId: service.id,
          key: action.key,
        },
      },
      update: {
        description: action.description,
        configSchema: toJsonValue(action.configSchema),
      },
      create: {
        serviceId: service.id,
        key: action.key,
        description: action.description,
        configSchema: toJsonValue(action.configSchema),
      },
    });

    console.log(`  ✅ Action ready: ${action.key}`);
  }

  for (const reaction of seed.reactions) {
    await prisma.reaction.upsert({
      where: {
        serviceId_key: {
          serviceId: service.id,
          key: reaction.key,
        },
      },
      update: {
        description: reaction.description,
        configSchema: toJsonValue(reaction.configSchema),
      },
      create: {
        serviceId: service.id,
        key: reaction.key,
        description: reaction.description,
        configSchema: toJsonValue(reaction.configSchema),
      },
    });

    console.log(`  ✅ Reaction ready: ${reaction.key}`);
  }
}

async function main() {
  console.log('🌱 Starting database seeding...');

  for (const serviceSeed of serviceSeeds) {
    await ensureService(serviceSeed);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
