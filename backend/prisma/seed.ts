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
        description: 'Déclenchée lorsqu’une nouvelle critique est publiée sur Letterboxd',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: "Nom d’utilisateur Letterboxd à surveiller",
            },
          },
        },
      },
      {
        key: 'new_diary_entry',
        description: 'Déclenchée lorsqu’un nouveau film est ajouté au journal',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: "Nom d’utilisateur Letterboxd à surveiller",
            },
          },
        },
      },
      {
        key: 'film_watched',
        description: 'Déclenchée lorsqu’un film est marqué comme vu',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: "Nom d’utilisateur Letterboxd à surveiller",
            },
          },
        },
      },
      {
        key: 'new_list',
        description: 'Déclenchée lorsqu’une nouvelle liste est créée',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: "Nom d’utilisateur Letterboxd à surveiller",
            },
          },
        },
      },
      {
        key: 'film_rated',
        description: 'Déclenchée lorsqu’un film est noté (1 à 5 étoiles)',
        configSchema: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              description: "Nom d’utilisateur Letterboxd à surveiller",
            },
            minRating: {
              type: 'number',
              description: 'Note minimale pour déclencher (optionnelle)',
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
        description: 'Envoyer les informations du film vers une URL de webhook',
        configSchema: {
          type: 'object',
          required: ['webhookUrl'],
          properties: {
            webhookUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL du webhook à laquelle transmettre les données du film',
            },
            includeReview: {
              type: 'boolean',
              description: 'Inclure le texte de la critique dans la charge utile',
              default: true,
            },
          },
        },
      },
      {
        key: 'log_activity',
        description: 'Consigner l’activité Letterboxd dans les journaux',
        configSchema: {
          type: 'object',
          properties: {
            logLevel: {
              type: 'string',
              enum: ['info', 'debug', 'verbose'],
              default: 'info',
              description: 'Niveau de journalisation à utiliser',
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
        description: 'Déclenchée lorsqu’une nouvelle issue est créée sur un dépôt',
        configSchema: {
          type: 'object',
          required: ['owner', 'repo'],
          properties: {
            owner: {
              type: 'string',
              description: 'Organisation ou nom d’utilisateur GitHub',
            },
            repo: {
              type: 'string',
              description: 'Nom du dépôt',
            },
          },
        },
      },
      {
        key: 'new_pull_request',
        description: 'Déclenchée lorsqu’une nouvelle pull request est ouverte sur un dépôt',
        configSchema: {
          type: 'object',
          required: ['owner', 'repo'],
          properties: {
            owner: {
              type: 'string',
              description: 'Organisation ou nom d’utilisateur GitHub',
            },
            repo: {
              type: 'string',
              description: 'Nom du dépôt',
            },
          },
        },
      },
      {
        key: 'new_release',
        description: 'Déclenchée lorsqu’une nouvelle release est publiée',
        configSchema: {
          type: 'object',
          required: ['owner', 'repo'],
          properties: {
            owner: {
              type: 'string',
              description: 'Organisation ou nom d’utilisateur GitHub',
            },
            repo: {
              type: 'string',
              description: 'Nom du dépôt',
            },
          },
        },
      },
    ],
    reactions: [
      {
        key: 'send_webhook',
        description: 'Envoyer les détails de l’activité GitHub vers un webhook',
        configSchema: {
          type: 'object',
          required: ['webhookUrl'],
          properties: {
            webhookUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL du webhook à laquelle envoyer les données GitHub',
            },
            includeBody: {
              type: 'boolean',
              description: 'Inclure le contenu de l’issue/PR/release dans la charge utile',
              default: true,
            },
          },
        },
      },
    ],
  },
  {
    slug: 'discord',
    name: 'Discord',
    actions: [
      {
        key: 'new_channel_message',
        description: 'Déclenchée lorsqu’un nouveau message est publié dans le salon configuré',
        configSchema: {
          type: 'object',
          required: ['guildId', 'channelId'],
          additionalProperties: false,
          properties: {
            guildId: {
              type: 'string',
              description: 'Identifiant du serveur Discord à surveiller',
              format: 'discord-guild',
            },
            channelId: {
              type: 'string',
              description: 'Identifiant du salon Discord (snowflake) à surveiller',
              format: 'discord-channel',
            },
            allowBots: {
              type: 'boolean',
              description: 'Déclencher également sur les messages publiés par des bots',
              default: false,
            },
            allowedUserIds: {
              type: 'array',
              description: 'Liste optionnelle d’identifiants d’auteurs autorisés à déclencher l’action',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
      {
        key: 'message_contains_keyword',
        description: 'Déclenchée lorsqu’un message contient au moins un des mots-clés spécifiés',
        configSchema: {
          type: 'object',
          required: ['guildId', 'channelId', 'keywords'],
          additionalProperties: false,
          properties: {
            guildId: {
              type: 'string',
              description: 'Identifiant du serveur Discord à surveiller',
              format: 'discord-guild',
            },
            channelId: {
              type: 'string',
              description: 'Identifiant du salon Discord (snowflake) à surveiller',
              format: 'discord-channel',
            },
            keywords: {
              type: 'array',
              minItems: 1,
              description: 'Mots-clés recherchés (insensibles à la casse)',
              items: {
                type: 'string',
              },
            },
            allowBots: {
              type: 'boolean',
              description: 'Déclencher également sur les messages publiés par des bots',
              default: false,
            },
            allowedUserIds: {
              type: 'array',
              description: 'Liste optionnelle d’identifiants d’auteurs autorisés à déclencher l’action',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
      {
        key: 'message_with_attachment',
        description: 'Déclenchée lorsqu’un message contient au moins une pièce jointe',
        configSchema: {
          type: 'object',
          required: ['guildId', 'channelId'],
          additionalProperties: false,
          properties: {
            guildId: {
              type: 'string',
              description: 'Identifiant du serveur Discord à surveiller',
              format: 'discord-guild',
            },
            channelId: {
              type: 'string',
              description: 'Identifiant du salon Discord (snowflake) à surveiller',
              format: 'discord-channel',
            },
            allowBots: {
              type: 'boolean',
              description: 'Déclencher également sur les messages publiés par des bots',
              default: false,
            },
            allowedUserIds: {
              type: 'array',
              description: 'Liste optionnelle d’identifiants d’auteurs autorisés à déclencher l’action',
              items: {
                type: 'string',
              },
            },
            allowedContentTypes: {
              type: 'array',
              description: 'Liste optionnelle de types MIME requis dans les pièces jointes',
              items: {
                type: 'string',
              },
            },
            requireImage: {
              type: 'boolean',
              description: 'Exiger que la pièce jointe soit une image (type MIME commençant par image/)',
              default: false,
            },
          },
        },
      },
    ],
    reactions: [
      {
        key: 'send_channel_message',
        description: 'Envoyer un message texte dans un salon Discord',
        configSchema: {
          type: 'object',
          required: ['contentTemplate'],
          additionalProperties: false,
          properties: {
            guildId: {
              type: 'string',
              description: 'Identifiant de serveur Discord optionnel pour faciliter la sélection du salon',
              format: 'discord-guild',
            },
            channelId: {
              type: 'string',
              description: 'Identifiant du salon cible. Utilise le salon source si non renseigné.',
              format: 'discord-channel',
            },
            contentTemplate: {
              type: 'string',
              description:
                'Modèle de message acceptant des variables comme {{activity.title}} ou {{activity.author.username}}',
            },
            mentionRoleIds: {
              type: 'array',
              description: 'Liste optionnelle d’identifiants de rôles à mentionner dans le message',
              items: {
                type: 'string',
              },
            },
            mentionUserIds: {
              type: 'array',
              description: 'Liste optionnelle d’identifiants d’utilisateurs à mentionner dans le message',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
      {
        key: 'send_embed_message',
        description: 'Envoyer un message enrichi (embed) dans un salon Discord',
        configSchema: {
          type: 'object',
          required: ['descriptionTemplate'],
          additionalProperties: false,
          properties: {
            guildId: {
              type: 'string',
              description: 'Identifiant de serveur Discord optionnel pour faciliter la sélection du salon',
              format: 'discord-guild',
            },
            channelId: {
              type: 'string',
              description: 'Identifiant du salon cible pour l’embed. Utilise le salon source si non renseigné.',
              format: 'discord-channel',
            },
            titleTemplate: {
              type: 'string',
              description:
                'Modèle de titre d’embed acceptant des variables (ex. {{activity.title}}). Optionnel.',
            },
            descriptionTemplate: {
              type: 'string',
              description:
                'Modèle de description pour l’embed, avec variables. Markdown pris en charge par Discord.',
            },
            urlTemplate: {
              type: 'string',
              description: 'URL optionnelle associée au titre de l’embed (variables autorisées).',
            },
            color: {
              type: 'integer',
              description: 'Code couleur décimal pour la bordure de l’embed (ex. 5814783).',
            },
            footerTemplate: {
              type: 'string',
              description: 'Modèle optionnel pour le pied de page.',
            },
          },
        },
      },
      {
        key: 'add_reaction',
        description: 'Ajouter une réaction emoji à un message',
        configSchema: {
          type: 'object',
          required: ['guildId', 'channelId', 'messageId', 'emoji'],
          additionalProperties: false,
          properties: {
            guildId: {
              type: 'string',
              description: 'Identifiant du serveur contenant le message',
              format: 'discord-guild',
            },
            channelId: {
              type: 'string',
              description: 'Identifiant du salon contenant le message ciblé',
              format: 'discord-channel',
            },
            messageId: {
              type: 'string',
              description: 'Identifiant du message auquel réagir',
            },
            emoji: {
              type: 'string',
              description:
                'Emoji à utiliser (unicode comme 😀 ou format personnalisé nom:id).',
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

  console.log(`✅ Service prêt : ${seed.name}`);

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

    console.log(`  ✅ Action disponible : ${action.key}`);
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

    console.log(`  ✅ Réaction disponible : ${reaction.key}`);
  }
}

async function main() {
  console.log('🌱 Démarrage du remplissage de la base...');

  for (const serviceSeed of serviceSeeds) {
    await ensureService(serviceSeed);
  }

  console.log('🎉 Remplissage terminé avec succès !');
}

main()
  .catch((error) => {
    console.error('❌ Échec du remplissage', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
