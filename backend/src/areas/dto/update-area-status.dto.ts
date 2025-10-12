import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateAreaStatusDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() === 'true' : Boolean(value),
  )
  @IsBoolean()
  enabled!: boolean;
}
