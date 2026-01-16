import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MenuItem,
  Order,
  OrderItem,
  Restaurant,
  User,
} from '../../domain/entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, MenuItem, Restaurant, User]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
