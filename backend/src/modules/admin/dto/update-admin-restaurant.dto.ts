import { PartialType } from '@nestjs/swagger';
import { CreateAdminRestaurantDto } from './create-admin-restaurant.dto';

export class UpdateAdminRestaurantDto extends PartialType(
  CreateAdminRestaurantDto,
) {}
