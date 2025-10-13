import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WeatherCheckDto {
  @ApiProperty({
    description: 'Name of the city to check weather for',
    example: 'Paris',
  })
  @IsString()
  @IsNotEmpty()
  city: string;
}

export class WeatherResponseDto {
  @ApiProperty({
    description: 'City name',
    example: 'Paris',
  })
  city: string;

  @ApiProperty({
    description: 'Weather condition',
    example: 'Rain',
  })
  condition: string;

  @ApiProperty({
    description: 'Weather description',
    example: 'light rain',
  })
  description: string;

  @ApiProperty({
    description: 'Temperature in Celsius',
    example: 15.5,
  })
  temperature: number;

  @ApiProperty({
    description: 'Whether it is raining',
    example: true,
  })
  isRaining: boolean;
}
