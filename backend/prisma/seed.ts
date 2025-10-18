import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if Letterboxd service already exists with actions and reactions
  const existingService = await prisma.service.findUnique({
    where: { slug: 'letterboxd' },
    include: {
      actions: true,
      reactions: true,
    },
  });

  if (existingService && existingService.actions.length > 0 && existingService.reactions.length > 0) {
    console.log('✨ Letterboxd service already seeded, skipping...');
    return;
  }

  // Add Letterboxd service
  const letterboxdService = await prisma.service.upsert({
    where: { slug: 'letterboxd' },
    update: {},
    create: {
      slug: 'letterboxd',
      name: 'Letterboxd',
      enabled: true,
    },
  });

  console.log(`✅ Created service: ${letterboxdService.name}`);

  // Add Actions for Letterboxd
  const actions = [
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
  ];

  for (const action of actions) {
    const created = await prisma.action.upsert({
      where: {
        serviceId_key: {
          serviceId: letterboxdService.id,
          key: action.key,
        },
      },
      update: {
        description: action.description,
        configSchema: action.configSchema,
      },
      create: {
        serviceId: letterboxdService.id,
        key: action.key,
        description: action.description,
        configSchema: action.configSchema,
      },
    });
    console.log(`  ✅ Created action: ${created.key}`);
  }

  // Add Reactions for Letterboxd
  const reactions = [
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
  ];

  for (const reaction of reactions) {
    const created = await prisma.reaction.upsert({
      where: {
        serviceId_key: {
          serviceId: letterboxdService.id,
          key: reaction.key,
        },
      },
      update: {
        description: reaction.description,
        configSchema: reaction.configSchema,
      },
      create: {
        serviceId: letterboxdService.id,
        key: reaction.key,
        description: reaction.description,
        configSchema: reaction.configSchema,
      },
    });
    console.log(`  ✅ Created reaction: ${created.key}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
