import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'List available services',
    schema: {
      type: 'object',
      properties: {
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              slug: { type: 'string' },
              name: { type: 'string' },
              actions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    key: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    configSchema: { type: 'object', nullable: true },
                  },
                },
              },
              reactions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    key: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    configSchema: { type: 'object', nullable: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async listServices() {
    const services = await this.servicesService.findAvailable();
    return { services };
  }
}
