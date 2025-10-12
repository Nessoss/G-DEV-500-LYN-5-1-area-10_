import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ServicesService {
  constructor(private readonly database: DatabaseService) {}

  /**
   * Return all enabled services with their actions and reactions.
   */
  async findAvailable() {
    const services = await this.database.service.findMany({
      where: { enabled: true },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      include: {
        actions: {
          orderBy: [{ key: 'asc' }],
        },
        reactions: {
          orderBy: [{ key: 'asc' }],
        },
      },
    });

    return services.map((service) => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
      actions: service.actions.map((action) => ({
        id: action.id,
        key: action.key,
        description: action.description,
        configSchema: action.configSchema,
      })),
      reactions: service.reactions.map((reaction) => ({
        id: reaction.id,
        key: reaction.key,
        description: reaction.description,
        configSchema: reaction.configSchema,
      })),
    }));
  }
}
