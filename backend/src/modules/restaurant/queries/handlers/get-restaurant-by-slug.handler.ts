import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../../../domain/entities';
import { RestaurantDetailDto } from '../../dto';
import { GetRestaurantBySlugQuery } from '../index';

@QueryHandler(GetRestaurantBySlugQuery)
export class GetRestaurantBySlugHandler implements IQueryHandler<GetRestaurantBySlugQuery> {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async execute(query: GetRestaurantBySlugQuery): Promise<RestaurantDetailDto> {
    const { slug } = query;

    const restaurant = await this.restaurantRepository.findOne({
      where: { slug },
      relations: ['categories', 'deals', 'deliveryZones'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Map to detail DTO
    const dto = new RestaurantDetailDto();
    Object.assign(dto, RestaurantDetailDto.fromEntity(restaurant));

    // Explicitly copy additional fields
    dto.openingHours = restaurant.openingHours;
    dto.latitude = Number(restaurant.latitude);
    dto.longitude = Number(restaurant.longitude);
    dto.phone = restaurant.phone;
    dto.email = restaurant.email;

    // TODO: Map categories and deals to their specific DTOs properly
    // For now we assume they are included in the response structure

    return dto;
  }
}
