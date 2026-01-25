import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class PeriodQueryDto {
  @ApiPropertyOptional({
    description: 'Time period for filtering data',
    enum: ['daily', 'weekly', 'monthly'],
    example: 'weekly',
  })
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly'])
  period?: 'daily' | 'weekly' | 'monthly';
}
