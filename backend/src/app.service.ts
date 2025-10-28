import { Injectable } from '@nestjs/common';
import type { AboutResponseDto } from './app/dto/about-response.dto';

@Injectable()
export class AppService {
  constructor(private readonly database: DatabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getAbout(): AboutResponseDto {
    const currentTime = Math.floor(Date.now() / 1000);

    // Fetch all enabled services with their actions and reactions from database
    const services = await this.database.service.findMany({
      where: { enabled: true },
      include: {
        actions: {
          orderBy: [{ key: 'asc' }],
        },
        reactions: {
          orderBy: [{ key: 'asc' }],
        },
      },
      orderBy: [{ name: 'asc' }],
    });

    return {
      client: {
        host: '127.0.0.1',
      },
      server: {
        current_time: currentTime,
        services: services.map((service) => ({
          name: service.slug,
          actions: service.actions.map((action) => ({
            name: action.key,
            description: action.description || '',
          })),
          reactions: service.reactions.map((reaction) => ({
            name: reaction.key,
            description: reaction.description || '',
          })),
        })),
      },
    };
  }
}
