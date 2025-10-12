import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Type(() => Number)
  @IsInt()
  actionId!: number;

  @Type(() => Number)
  @IsInt()
  reactionId!: number;

  @IsOptional()
  @IsObject()
  actionConfig?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  reactionConfig?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  dedupKeyStrategy?: string;
}
