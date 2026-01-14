"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemOptionResponseDto = exports.OrderItemResponseDto = exports.OrderResponseDto = void 0;
const dto_1 = require("../../restaurant/dto");
class OrderResponseDto {
    id;
    orderNumber;
    status;
    totalAmount;
    deliveryFee;
    discountAmount;
    subtotal;
    createdAt;
    deliveryType;
    paymentStatus;
    restaurant;
    items;
    user;
    static fromEntity(entity) {
        const dto = new OrderResponseDto();
        dto.id = entity.id;
        dto.orderNumber = entity.id.substring(0, 8).toUpperCase();
        dto.status = entity.status;
        dto.totalAmount = Number(entity.total);
        dto.deliveryFee = Number(entity.deliveryFee);
        dto.discountAmount = Number(entity.discount);
        dto.subtotal = Number(entity.subtotal);
        dto.createdAt = entity.createdAt;
        dto.deliveryType = entity.deliveryType;
        dto.paymentStatus = entity.paymentStatus;
        if (entity.restaurant) {
            dto.restaurant = dto_1.RestaurantResponseDto.fromEntity(entity.restaurant);
        }
        dto.items = entity.items?.map(OrderItemResponseDto.fromEntity) || [];
        return dto;
    }
}
exports.OrderResponseDto = OrderResponseDto;
class OrderItemResponseDto {
    id;
    itemName;
    quantity;
    unitPrice;
    totalPrice;
    options;
    static fromEntity(entity) {
        const dto = new OrderItemResponseDto();
        dto.id = entity.id;
        dto.itemName = entity.menuItemName;
        dto.quantity = entity.quantity;
        dto.unitPrice = Number(entity.unitPrice);
        dto.totalPrice = Number(entity.totalPrice);
        dto.options =
            entity.selectedOptions?.map(OrderItemOptionResponseDto.fromEntity) || [];
        return dto;
    }
}
exports.OrderItemResponseDto = OrderItemResponseDto;
class OrderItemOptionResponseDto {
    name;
    price;
    static fromEntity(entity) {
        const dto = new OrderItemOptionResponseDto();
        dto.name = entity.optionName;
        dto.price = Number(entity.additionalPrice);
        return dto;
    }
}
exports.OrderItemOptionResponseDto = OrderItemOptionResponseDto;
//# sourceMappingURL=order-response.dto.js.map