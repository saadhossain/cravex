import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../domain/entities';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'The phone number of the user',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({ example: 'customer', description: 'The role of the user' })
  role: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'The avatar URL of the user',
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({ example: true, description: 'Whether the email is verified' })
  isEmailVerified: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date when the user was created',
  })
  createdAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.phone = user.phone;
    dto.role = user.role;
    dto.avatarUrl = user.avatarUrl;
    dto.isEmailVerified = user.isEmailVerified;
    dto.createdAt = user.createdAt;
    return dto;
  }
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: 'The access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: 'The refresh token',
  })
  refreshToken: string;

  @ApiProperty({ type: UserResponseDto, description: 'The user information' })
  user: UserResponseDto;
}

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: 'The access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: 'The refresh token',
  })
  refreshToken: string;
}
