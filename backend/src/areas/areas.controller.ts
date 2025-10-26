import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@ApiTags('areas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArea(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateAreaDto,
  ) {
    return this.areasService.create(user.id, dto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List areas for the authenticated user',
  })
  async getAreas(@CurrentUser() user: CurrentUserPayload) {
    const areas = await this.areasService.findForUser(user.id);
    return { areas };
  }

  @Put(':id')
  async toggleArea(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAreaStatusDto,
  ) {
    return this.areasService.updateStatus(user.id, id, dto);
  }

  @Patch(':id')
  async updateArea(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAreaDto,
  ) {
    return this.areasService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArea(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.areasService.remove(user.id, id);
  }
}
