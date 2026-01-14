import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { Restaurant } from '../../../../domain/entities';
import { RestaurantResponseDto } from '../../dto';
import { UpdateRestaurantCommand } from '../index';

@CommandHandler(UpdateRestaurantCommand)
export class UpdateRestaurantHandler implements ICommandHandler<UpdateRestaurantCommand> {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async execute(
    command: UpdateRestaurantCommand,
  ): Promise<RestaurantResponseDto> {
    const { restaurantId, ownerId, dto } = command;

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Access control check
    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    // Update fields
    Object.assign(restaurant, dto);

    // If name changes, update slug
    if (dto.name && dto.name !== restaurant.name) {
      let slug = slugify(dto.name, { lower: true, strict: true });
      const slugExists = await this.restaurantRepository.findOne({
        where: { slug },
      });
      if (slugExists && slugExists.id !== restaurant.id) {
        slug = `${slug}-${Date.now()}`;
      }
      restaurant.slug = slug;
    }

    const updatedRestaurant = await this.restaurantRepository.save(restaurant);
    return RestaurantResponseDto.fromEntity(updatedRestaurant);
  }
}
