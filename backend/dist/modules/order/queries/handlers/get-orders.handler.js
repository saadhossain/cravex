"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrderDetailHandler = exports.GetOrdersHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../../../../domain/entities/order.entity");
const typeorm_2 = require("typeorm");
const dto_1 = require("../../dto");
const index_1 = require("../index");
let GetOrdersHandler = class GetOrdersHandler {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(query) {
        const { userId } = query;
        const orders = await this.orderRepository.find({
            where: { userId },
            relations: ['restaurant', 'items'],
            order: { createdAt: 'DESC' },
        });
        return orders.map(dto_1.OrderResponseDto.fromEntity);
    }
};
exports.GetOrdersHandler = GetOrdersHandler;
exports.GetOrdersHandler = GetOrdersHandler = __decorate([
    (0, cqrs_1.QueryHandler)(index_1.GetOrdersQuery),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetOrdersHandler);
let GetOrderDetailHandler = class GetOrderDetailHandler {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(query) {
        const { userId, orderId } = query;
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['restaurant', 'items', 'items.selectedOptions'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('You do not own this order');
        }
        return dto_1.OrderResponseDto.fromEntity(order);
    }
};
exports.GetOrderDetailHandler = GetOrderDetailHandler;
exports.GetOrderDetailHandler = GetOrderDetailHandler = __decorate([
    (0, cqrs_1.QueryHandler)(index_1.GetOrderDetailQuery),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetOrderDetailHandler);
//# sourceMappingURL=get-orders.handler.js.map