import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../domain/entities';
import { CurrentUser, Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CreateOrderCommand } from './commands';
import {
  AdminOrdersQueryDto,
  CreateAdminOrderDto,
  CreateOrderDto,
  OrderResponseDto,
  UpdateAdminOrderDto,
} from './dto';
import { OrderService } from './order.service';
import { GetOrderDetailQuery, GetOrdersQuery } from './queries';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly orderService: OrderService,
  ) {}

  // ============ User Endpoints ============

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(
    @CurrentUser() user: User,
    @Body() dto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.commandBus.execute(new CreateOrderCommand(user.id, dto));
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for current user' })
  async getOrders(@CurrentUser() user: User): Promise<OrderResponseDto[]> {
    return this.queryBus.execute(new GetOrdersQuery(user.id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  async getOrder(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<OrderResponseDto> {
    return this.queryBus.execute(new GetOrderDetailQuery(user.id, id));
  }

  // ============ Admin/Superadmin Endpoints ============

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders with filtering (admin)' })
  async getOrdersAdmin(@Query() query: AdminOrdersQueryDto) {
    return this.orderService.getOrdersAdmin(query);
  }

  @Post('admin')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order for a user (admin)' })
  async createOrderAdmin(@Body() createOrderDto: CreateAdminOrderDto) {
    return this.orderService.createOrderAdmin(createOrderDto);
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order details by ID (admin)' })
  async getOrderAdmin(@Param('id') id: string) {
    return this.orderService.getOrderAdmin(id);
  }

  @Patch('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an order (admin)' })
  async updateOrderAdmin(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateAdminOrderDto,
  ) {
    return this.orderService.updateOrderAdmin(id, updateOrderDto);
  }
}
