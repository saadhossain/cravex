import { CreateRestaurantDto, UpdateRestaurantDto } from '../dto';

export class CreateRestaurantCommand {
  constructor(
    public readonly ownerId: string,
    public readonly dto: CreateRestaurantDto,
  ) {}
}

export class UpdateRestaurantCommand {
  constructor(
    public readonly restaurantId: string,
    public readonly ownerId: string, // for authorization check
    public readonly dto: UpdateRestaurantDto,
  ) {}
}
