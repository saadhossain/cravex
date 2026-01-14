import { RestaurantListQueryDto } from '../dto';

export class GetRestaurantsQuery {
  constructor(public readonly query: RestaurantListQueryDto) {}
}

export class GetRestaurantBySlugQuery {
  constructor(public readonly slug: string) {}
}

export class GetRestaurantByIdQuery {
  constructor(public readonly id: string) {}
}
