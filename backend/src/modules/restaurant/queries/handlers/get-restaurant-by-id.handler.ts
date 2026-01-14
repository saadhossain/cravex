import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../../../domain/entities';
import { RestaurantResponseDto } from '../../dto';
import { GetRestaurantByIdQuery } from '../index';

@QueryHandler(GetRestaurantByIdQuery)
export class GetRestaurantByIdHandler implements IQueryHandler<GetRestaurantByIdQuery> {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async execute(query: GetRestaurantByIdQuery): Promise<RestaurantResponseDto> {
    const { id } = query;

    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return RestaurantResponseDto.fromEntity(restaurant);
  }
}
