"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = exports.QueryHandlers = exports.CommandHandlers = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../domain/entities");
const auth_module_1 = require("../auth/auth.module");
const order_controller_1 = require("./order.controller");
const order_entity_1 = require("../../domain/entities/order.entity");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
exports.CommandHandlers = [handlers_1.CreateOrderHandler];
exports.QueryHandlers = [handlers_2.GetOrdersHandler, handlers_2.GetOrderDetailHandler];
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                entities_1.OrderItem,
                entities_1.OrderItemOption,
                entities_1.Cart,
                entities_1.CartItem,
                entities_1.User,
                entities_1.Restaurant,
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [order_controller_1.OrderController],
        providers: [...exports.CommandHandlers, ...exports.QueryHandlers],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map