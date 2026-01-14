export class GetMenuByRestaurantQuery {
  constructor(public readonly restaurantId: string) {}
}

export class GetMenuItemDetailQuery {
  constructor(public readonly menuItemId: string) {}
}

export class GetCategoriesQuery {
  constructor(public readonly restaurantId: string) {}
}
