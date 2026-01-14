import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsEnum(['delivery', 'collection'])
  deliveryType: 'delivery' | 'collection';

  @IsOptional() // Required if deliveryType is delivery
  @IsUUID()
  addressId?: string;
  // Should we allow inline address creation?
  // Plan says "Delivery Address Management... separate resource".
  // So we accept addressId.

  @IsEnum(['stripe', 'cash', 'cod']) // Assuming these types
  paymentMethod: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
