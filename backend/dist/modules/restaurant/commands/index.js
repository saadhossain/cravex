"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRestaurantCommand = exports.CreateRestaurantCommand = void 0;
class CreateRestaurantCommand {
    ownerId;
    dto;
    constructor(ownerId, dto) {
        this.ownerId = ownerId;
        this.dto = dto;
    }
}
exports.CreateRestaurantCommand = CreateRestaurantCommand;
class UpdateRestaurantCommand {
    restaurantId;
    ownerId;
    dto;
    constructor(restaurantId, ownerId, dto) {
        this.restaurantId = restaurantId;
        this.ownerId = ownerId;
        this.dto = dto;
    }
}
exports.UpdateRestaurantCommand = UpdateRestaurantCommand;
//# sourceMappingURL=index.js.map