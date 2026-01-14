"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRestaurantByIdQuery = exports.GetRestaurantBySlugQuery = exports.GetRestaurantsQuery = void 0;
class GetRestaurantsQuery {
    query;
    constructor(query) {
        this.query = query;
    }
}
exports.GetRestaurantsQuery = GetRestaurantsQuery;
class GetRestaurantBySlugQuery {
    slug;
    constructor(slug) {
        this.slug = slug;
    }
}
exports.GetRestaurantBySlugQuery = GetRestaurantBySlugQuery;
class GetRestaurantByIdQuery {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.GetRestaurantByIdQuery = GetRestaurantByIdQuery;
//# sourceMappingURL=index.js.map