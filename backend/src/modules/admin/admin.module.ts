import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Restaurant, User } from '../../domain/entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, User])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
