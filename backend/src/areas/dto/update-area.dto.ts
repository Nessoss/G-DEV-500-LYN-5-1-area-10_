import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAreaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  actionId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  reactionId?: number;

  @IsOptional()
  @IsObject()
  actionConfig?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  reactionConfig?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  dedupKeyStrategy?: string | null;
}
