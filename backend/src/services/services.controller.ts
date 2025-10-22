import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

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
  async listServices(@Req() request: Request) {
    const user = request.user as JwtPayload;
    const userId = parseInt(user.sub, 10);
    const services = await this.servicesService.findAvailable(userId);
    return { services };
  }
}
