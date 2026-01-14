"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderCommand = exports.UpdateParameters = exports.CreateOrderCommand = void 0;
class CreateOrderCommand {
    userId;
    dto;
    constructor(userId, dto) {
        this.userId = userId;
        this.dto = dto;
    }
}
exports.CreateOrderCommand = CreateOrderCommand;
class UpdateParameters {
    status;
}
exports.UpdateParameters = UpdateParameters;
class UpdateOrderCommand {
    orderId;
    userId;
    params;
    constructor(orderId, userId, params) {
        this.orderId = orderId;
        this.userId = userId;
        this.params = params;
    }
}
exports.UpdateOrderCommand = UpdateOrderCommand;
//# sourceMappingURL=index.js.map