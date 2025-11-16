import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { AuthModule } from '../auth/auth.module';
import { SlackModule } from '../slack/slack.module';

@Module({
  imports: [AuthModule, SlackModule],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
