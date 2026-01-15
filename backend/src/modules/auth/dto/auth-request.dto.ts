import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user (min 8 characters)',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'The phone number of the user',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    enum: ['restaurant', 'customer'],
    default: 'customer',
    description: 'The role of the user',
  })
  @IsOptional()
  @IsEnum(['restaurant', 'customer'])
  role?: 'restaurant' | 'customer' = 'customer';
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'some-refresh-token',
    description: 'The refresh token',
  })
  @IsString()
  refreshToken: string;
}
