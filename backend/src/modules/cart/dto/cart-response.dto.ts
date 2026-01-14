import { Cart, CartItem, CartItemOption } from 'src/domain/entities';
import { MenuItemResponseDto } from '../../menu/dto';
import { RestaurantResponseDto } from '../../restaurant/dto';

export class CartItemOptionResponseDto {
  id: string;
  optionName: string; // We need to resolve name? Or return full option object?
  // Entity has `menuOption`.
  // DTO in plan: optionName, additionalPrice.
  // We'll return resolved values.
  additionalPrice: number;

  static fromEntity(entity: CartItemOption): CartItemOptionResponseDto {
    const dto = new CartItemOptionResponseDto();
    dto.id = entity.id;
    // We assume menuOption is loaded
    dto.optionName = entity.menuOption?.name || 'Unknown';
    dto.additionalPrice = Number(entity.additionalPrice);
    return dto;
  }
}

export class CartItemResponseDto {
  id: string;
  menuItem: MenuItemResponseDto;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions: CartItemOptionResponseDto[];
  specialInstructions: string;

  static fromEntity(entity: CartItem): CartItemResponseDto {
    const dto = new CartItemResponseDto();
    dto.id = entity.id;
    if (entity.menuItem) {
      dto.menuItem = MenuItemResponseDto.fromEntity(entity.menuItem);
    }
    dto.quantity = entity.quantity;
    dto.unitPrice = Number(entity.unitPrice);
    // calculate total price
    const optionsTotal =
      entity.selectedOptions?.reduce(
        (sum: number, opt: CartItemOption) => sum + Number(opt.additionalPrice),
        0,
      ) || 0;
    dto.totalPrice =
      (Number(entity.unitPrice) + optionsTotal) * entity.quantity;

    dto.selectedOptions =
      entity.selectedOptions?.map(CartItemOptionResponseDto.fromEntity) || [];
    dto.specialInstructions = entity.specialInstructions;
    return dto;
  }
}

export class CartResponseDto {
  id: string;
  restaurant: RestaurantResponseDto;
  items: CartItemResponseDto[];
  deliveryType: 'delivery' | 'collection';
  couponCode: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;

  // Validation fields
  minimumDeliveryMet: boolean;
  amountToMinimum: number;

  static fromEntity(entity: Cart): CartResponseDto {
    const dto = new CartResponseDto();
    dto.id = entity.id;
    if (entity.restaurant) {
      dto.restaurant = RestaurantResponseDto.fromEntity(entity.restaurant);
    }
    dto.items = entity.items?.map(CartItemResponseDto.fromEntity) || [];
    dto.deliveryType = entity.deliveryType;
    dto.couponCode = entity.couponCode;

    // Calculations logic needs to be in handler or service or entity method
    // For DTO mapping, we assume fields are populated or calculate simple ones
    // But entities don't likely have 'subtotal' column (Cart table didn't).
    // So calculation should happen before mapping or mapped here.
    // I'll map what I can.

    let subtotal = 0;
    dto.items.forEach((item) => (subtotal += item.totalPrice));
    dto.subtotal = subtotal;

    dto.discount = Number(entity.discountAmount) || 0;
    // deliveryFee logic depends on restaurant settings
    dto.deliveryFee = 0; // Placeholder
    dto.total = subtotal - dto.discount + dto.deliveryFee;

    return dto;
  }
}
