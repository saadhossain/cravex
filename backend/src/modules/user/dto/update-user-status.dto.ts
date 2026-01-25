import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'User active status' })
  @IsBoolean()
  isActive: boolean;
}
