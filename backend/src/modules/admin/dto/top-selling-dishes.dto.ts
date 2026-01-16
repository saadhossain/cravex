import { ApiProperty } from '@nestjs/swagger';

export class TopSellingDishDto {
  @ApiProperty({ description: 'Dish ID' })
  id: string;

  @ApiProperty({ description: 'Dish name' })
  name: string;

  @ApiProperty({ description: 'Dish image URL', nullable: true })
  image?: string;

  @ApiProperty({ description: 'Dish price' })
  price: number;

  @ApiProperty({ description: 'Total order count for this dish' })
  orderCount: number;

  @ApiProperty({ description: 'Order rate change percentage' })
  orderRate: number;

  @ApiProperty({ description: 'Whether the rate change is positive' })
  isPositive: boolean;
}

export class TopSellingDishesResponseDto {
  @ApiProperty({ type: [TopSellingDishDto] })
  dishes: TopSellingDishDto[];

  @ApiProperty({ description: 'Overall order rate change' })
  overallRate: {
    value: number;
    isPositive: boolean;
  };
}
