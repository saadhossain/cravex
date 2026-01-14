import { OrderItem, OrderItemOption } from 'src/domain/entities';
import { Order } from 'src/domain/entities/order.entity';
import { UserResponseDto } from '../../auth/dto';
import { RestaurantResponseDto } from '../../restaurant/dto';

export class OrderResponseDto {
  id: string;
  orderNumber: string; // Friendly ID if exists, or UUID
  status: string;
  totalAmount: number;
  deliveryFee: number;
  discountAmount: number;
  subtotal: number;
  createdAt: Date;
  deliveryType: string;
  paymentStatus: string;

  // Relations
  restaurant: RestaurantResponseDto;
  items: OrderItemResponseDto[];
  user?: UserResponseDto; // Optional depending on context

  static fromEntity(entity: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = entity.id;
    // entity doesn't have orderNumber in plan? Using ID for now.
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
      dto.restaurant = RestaurantResponseDto.fromEntity(entity.restaurant);
    }

    dto.items = entity.items?.map(OrderItemResponseDto.fromEntity) || [];

    return dto;
  }
}

export class OrderItemResponseDto {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options: OrderItemOptionResponseDto[];

  static fromEntity(entity: OrderItem): OrderItemResponseDto {
    const dto = new OrderItemResponseDto();
    dto.id = entity.id;
    dto.itemName = entity.menuItemName; // Snapshot name
    dto.quantity = entity.quantity;
    dto.unitPrice = Number(entity.unitPrice);
    dto.totalPrice = Number(entity.totalPrice);
    dto.options =
      entity.selectedOptions?.map(OrderItemOptionResponseDto.fromEntity) || [];
    return dto;
  }
}

export class OrderItemOptionResponseDto {
  name: string;
  price: number;

  static fromEntity(entity: OrderItemOption): OrderItemOptionResponseDto {
    const dto = new OrderItemOptionResponseDto();
    dto.name = entity.optionName;
    dto.price = Number(entity.additionalPrice);
    return dto;
  }
}
