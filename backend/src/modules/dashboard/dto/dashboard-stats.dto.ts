// Dashboard Statistics DTO
import { ApiProperty } from '@nestjs/swagger';

export class OrdersByStatusDto {
  @ApiProperty({ example: 5 })
  pending: number;

  @ApiProperty({ example: 3 })
  confirmed: number;

  @ApiProperty({ example: 2 })
  preparing: number;

  @ApiProperty({ example: 1 })
  ready: number;

  @ApiProperty({ example: 4 })
  out_for_delivery: number;

  @ApiProperty({ example: 50 })
  delivered: number;

  @ApiProperty({ example: 2 })
  cancelled: number;
}

export class RevenueByDayDto {
  @ApiProperty({ example: '2026-01-15' })
  date: string;

  @ApiProperty({ example: 1250.5 })
  revenue: number;

  @ApiProperty({ example: 15 })
  orders: number;
}

export class RecentOrderDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'ORD-20260115-001' })
  orderNumber: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 45.99 })
  total: number;

  @ApiProperty({ example: 'Tandoori Pizza' })
  restaurantName: string;

  @ApiProperty({ example: 'John Doe' })
  customerName: string;

  @ApiProperty({ example: 'delivery' })
  deliveryType: string;

  @ApiProperty({ example: '2026-01-15T18:30:00Z' })
  createdAt: Date;
}

export class DashboardStatsDto {
  @ApiProperty({ example: 150 })
  totalOrders: number;

  @ApiProperty({ example: 8750.5 })
  totalRevenue: number;

  @ApiProperty({ example: 12 })
  totalRestaurants: number;

  @ApiProperty({ example: 85 })
  totalCustomers: number;

  @ApiProperty({ example: 5 })
  pendingOrders: number;

  @ApiProperty({ example: 145.8 })
  averageOrderValue: number;

  @ApiProperty({ type: OrdersByStatusDto })
  ordersByStatus: OrdersByStatusDto;

  @ApiProperty({ type: [RevenueByDayDto] })
  revenueByDay: RevenueByDayDto[];

  @ApiProperty({ type: [RecentOrderDto] })
  recentOrders: RecentOrderDto[];
}
