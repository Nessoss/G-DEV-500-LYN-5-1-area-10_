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
    slug: 'openweather',
    name: 'OpenWeather',
    actions: [
      {
        key: 'temperature_below_x',
        description: 'Triggered when temperature is below a threshold',
        configSchema: {
          type: 'object',
          required: ['city', 'threshold'],
          properties: {
            city: {
              type: 'string',
              description: 'City name (e.g., Paris, London, New York)',
            },
            threshold: {
              type: 'number',
              description: 'Temperature threshold in Celsius',
              minimum: -50,
              maximum: 60,
            },
          },
        },
      },
      {
        key: 'weather_condition_is',
        description: 'Triggered when current weather matches a condition',
        configSchema: {
          type: 'object',
          required: ['city', 'condition'],
          properties: {
            city: {
              type: 'string',
              description: 'City name (e.g., Paris, London, New York)',
            },
            condition: {
              type: 'string',
              enum: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Snow', 'Thunderstorm', 'Mist', 'Fog'],
              description: 'Weather condition to monitor',
            },
          },
        },
      },
    ],
    reactions: [
      {
        key: 'send_webhook',
        description: 'Send weather data to a webhook URL',
        configSchema: {
          type: 'object',
          required: ['webhookUrl'],
          properties: {
            webhookUrl: {
              type: 'string',
              format: 'uri',
              description: 'Webhook URL to send the weather data',
            },
          },
        },
      },
      {
        key: 'log_activity',
        description: 'Log weather activity to console/logs',
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
