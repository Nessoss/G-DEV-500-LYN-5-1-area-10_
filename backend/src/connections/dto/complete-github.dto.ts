import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteGithubDto {
  @ApiProperty({
    example: '1a2b3c4d',
    description: 'OAuth authorization code returned by GitHub',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: '0a7f599e-62a3-4b35-bc1c-374c4511eddf',
    description: 'State parameter originally issued when starting the flow',
  })
  @IsString()
  @IsNotEmpty()
  state: string;
}
