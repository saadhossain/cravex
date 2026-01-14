"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrderDetailQuery = exports.GetOrdersQuery = void 0;
class GetOrdersQuery {
    userId;
    constructor(userId) {
        this.userId = userId;
    }
}
exports.GetOrdersQuery = GetOrdersQuery;
class GetOrderDetailQuery {
    userId;
    orderId;
    constructor(userId, orderId) {
        this.userId = userId;
        this.orderId = orderId;
    }
}
exports.GetOrderDetailQuery = GetOrderDetailQuery;
//# sourceMappingURL=index.js.map