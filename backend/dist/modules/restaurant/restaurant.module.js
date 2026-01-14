"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModule = exports.QueryHandlers = exports.CommandHandlers = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../domain/entities");
const auth_module_1 = require("../auth/auth.module");
const restaurant_controller_1 = require("./restaurant.controller");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
exports.CommandHandlers = [
    handlers_1.CreateRestaurantHandler,
    handlers_1.UpdateRestaurantHandler,
];
exports.QueryHandlers = [
    handlers_2.GetRestaurantsHandler,
    handlers_2.GetRestaurantBySlugHandler,
    handlers_2.GetRestaurantByIdHandler,
];
let RestaurantModule = class RestaurantModule {
};
exports.RestaurantModule = RestaurantModule;
exports.RestaurantModule = RestaurantModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([entities_1.Restaurant, entities_1.User]),
            auth_module_1.AuthModule,
        ],
        controllers: [restaurant_controller_1.RestaurantController],
        providers: [...exports.CommandHandlers, ...exports.QueryHandlers],
        exports: [],
    })
], RestaurantModule);
//# sourceMappingURL=restaurant.module.js.map