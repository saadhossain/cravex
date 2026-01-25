import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAdminOrderDto } from './create-admin-order.dto';

export class UpdateAdminOrderDto extends PartialType(CreateAdminOrderDto) {
  @ApiPropertyOptional({ description: 'Order status' })
  @IsOptional()
  @IsString()
  status?: string;
}
