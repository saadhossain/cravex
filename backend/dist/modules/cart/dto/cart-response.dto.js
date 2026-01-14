"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResponseDto = exports.CartItemResponseDto = exports.CartItemOptionResponseDto = void 0;
const dto_1 = require("../../menu/dto");
const dto_2 = require("../../restaurant/dto");
class CartItemOptionResponseDto {
    id;
    optionName;
    additionalPrice;
    static fromEntity(entity) {
        const dto = new CartItemOptionResponseDto();
        dto.id = entity.id;
        dto.optionName = entity.menuOption?.name || 'Unknown';
        dto.additionalPrice = Number(entity.additionalPrice);
        return dto;
    }
}
exports.CartItemOptionResponseDto = CartItemOptionResponseDto;
class CartItemResponseDto {
    id;
    menuItem;
    quantity;
    unitPrice;
    totalPrice;
    selectedOptions;
    specialInstructions;
    static fromEntity(entity) {
        const dto = new CartItemResponseDto();
        dto.id = entity.id;
        if (entity.menuItem) {
            dto.menuItem = dto_1.MenuItemResponseDto.fromEntity(entity.menuItem);
        }
        dto.quantity = entity.quantity;
        dto.unitPrice = Number(entity.unitPrice);
        const optionsTotal = entity.selectedOptions?.reduce((sum, opt) => sum + Number(opt.additionalPrice), 0) || 0;
        dto.totalPrice =
            (Number(entity.unitPrice) + optionsTotal) * entity.quantity;
        dto.selectedOptions =
            entity.selectedOptions?.map(CartItemOptionResponseDto.fromEntity) || [];
        dto.specialInstructions = entity.specialInstructions;
        return dto;
    }
}
exports.CartItemResponseDto = CartItemResponseDto;
class CartResponseDto {
    id;
    restaurant;
    items;
    deliveryType;
    couponCode;
    subtotal;
    discount;
    deliveryFee;
    total;
    minimumDeliveryMet;
    amountToMinimum;
    static fromEntity(entity) {
        const dto = new CartResponseDto();
        dto.id = entity.id;
        if (entity.restaurant) {
            dto.restaurant = dto_2.RestaurantResponseDto.fromEntity(entity.restaurant);
        }
        dto.items = entity.items?.map(CartItemResponseDto.fromEntity) || [];
        dto.deliveryType = entity.deliveryType;
        dto.couponCode = entity.couponCode;
        let subtotal = 0;
        dto.items.forEach((item) => (subtotal += item.totalPrice));
        dto.subtotal = subtotal;
        dto.discount = Number(entity.discountAmount) || 0;
        dto.deliveryFee = 0;
        dto.total = subtotal - dto.discount + dto.deliveryFee;
        return dto;
    }
}
exports.CartResponseDto = CartResponseDto;
//# sourceMappingURL=cart-response.dto.js.map