"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriesQuery = exports.GetMenuItemDetailQuery = exports.GetMenuByRestaurantQuery = void 0;
class GetMenuByRestaurantQuery {
    restaurantId;
    constructor(restaurantId) {
        this.restaurantId = restaurantId;
    }
}
exports.GetMenuByRestaurantQuery = GetMenuByRestaurantQuery;
class GetMenuItemDetailQuery {
    menuItemId;
    constructor(menuItemId) {
        this.menuItemId = menuItemId;
    }
}
exports.GetMenuItemDetailQuery = GetMenuItemDetailQuery;
class GetCategoriesQuery {
    restaurantId;
    constructor(restaurantId) {
        this.restaurantId = restaurantId;
    }
}
exports.GetCategoriesQuery = GetCategoriesQuery;
//# sourceMappingURL=index.js.map