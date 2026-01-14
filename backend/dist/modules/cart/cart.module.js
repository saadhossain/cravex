"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = exports.QueryHandlers = exports.CommandHandlers = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../domain/entities");
const auth_module_1 = require("../auth/auth.module");
const cart_controller_1 = require("./cart.controller");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
exports.CommandHandlers = [
    handlers_1.AddToCartHandler,
    handlers_1.UpdateCartItemHandler,
    handlers_1.RemoveCartItemHandler,
];
exports.QueryHandlers = [handlers_2.GetCartHandler];
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.Cart,
                entities_1.CartItem,
                entities_1.CartItemOption,
                entities_1.MenuItem,
                entities_1.Restaurant,
                entities_1.MenuOption,
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [cart_controller_1.CartController],
        providers: [...exports.CommandHandlers, ...exports.QueryHandlers],
    })
], CartModule);
//# sourceMappingURL=cart.module.js.map