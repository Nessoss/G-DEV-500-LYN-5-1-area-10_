import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class LinkSlackDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inviteUserIds?: string[];
}
