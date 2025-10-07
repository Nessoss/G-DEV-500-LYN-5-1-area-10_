import { ApiProperty } from '@nestjs/swagger';

class LoginUserDto {
  @ApiProperty({
    example: '6f1b88c8-2b8d-4bd4-9cb8-0a6ec9221f2f',
    description: 'Unique identifier of the authenticated user',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the authenticated user',
  })
  email: string;

  @ApiProperty({
    example: ['user'],
    description: 'Roles assigned to the user',
    isArray: true,
    type: String,
  })
  roles: string[];
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access token to authenticate subsequent requests',
  })
  access_token: string;

  @ApiProperty({
    example: 600,
    description: 'Access token expiration time in seconds',
  })
  expires_in: number;

  @ApiProperty({
    example: 'Bearer',
    description: 'Type of the issued token',
    default: 'Bearer',
  })
  token_type: 'Bearer';

  @ApiProperty({
    type: LoginUserDto,
  })
  user: LoginUserDto;
}

export class UnauthorizedResponseDto {
  @ApiProperty({
    example: 'Invalid credentials',
  })
  message: string;
}

export class TooManyRequestsResponseDto {
  @ApiProperty({
    example: 'Too many login attempts. Try again later.',
  })
  message: string;
}
