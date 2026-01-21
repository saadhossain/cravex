import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateRestaurantDto } from '../../restaurant/dto/restaurant-request.dto';

export class CreateAdminRestaurantDto extends CreateRestaurantDto {
  @ApiPropertyOptional({
    description:
      'ID of the owner (user). Required if newOwner is not provided.',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({
    description:
      'Details to create a new owner user. Required if ownerId is not provided.',
  })
  @IsOptional()
  newOwner?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  };
}
