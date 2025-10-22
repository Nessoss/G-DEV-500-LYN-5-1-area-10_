import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteGithubDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}
