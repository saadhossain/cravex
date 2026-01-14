"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCartCommand = exports.RemoveCartItemCommand = exports.UpdateCartItemCommand = exports.AddToCartCommand = void 0;
class AddToCartCommand {
    userId;
    dto;
    constructor(userId, dto) {
        this.userId = userId;
        this.dto = dto;
    }
}
exports.AddToCartCommand = AddToCartCommand;
class UpdateCartItemCommand {
    userId;
    cartItemId;
    dto;
    constructor(userId, cartItemId, dto) {
        this.userId = userId;
        this.cartItemId = cartItemId;
        this.dto = dto;
    }
}
exports.UpdateCartItemCommand = UpdateCartItemCommand;
class RemoveCartItemCommand {
    userId;
    cartItemId;
    constructor(userId, cartItemId) {
        this.userId = userId;
        this.cartItemId = cartItemId;
    }
}
exports.RemoveCartItemCommand = RemoveCartItemCommand;
class ClearCartCommand {
    userId;
    constructor(userId) {
        this.userId = userId;
    }
}
exports.ClearCartCommand = ClearCartCommand;
//# sourceMappingURL=index.js.map