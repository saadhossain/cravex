import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { Restaurant, User } from '../../../../domain/entities';
import { RestaurantResponseDto } from '../../dto';
import { CreateRestaurantCommand } from '../index';

@CommandHandler(CreateRestaurantCommand)
export class CreateRestaurantHandler implements ICommandHandler<CreateRestaurantCommand> {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(
    command: CreateRestaurantCommand,
  ): Promise<RestaurantResponseDto> {
    const { ownerId, dto } = command;

    // Check if user already has a restaurant
    const existingRestaurant = await this.restaurantRepository.findOne({
      where: { ownerId },
    });

    if (existingRestaurant) {
      throw new ConflictException('User already owns a restaurant');
    }

    // Generate slug
    let slug = slugify(dto.name, { lower: true, strict: true });

    // Check for slug collision
    const slugExists = await this.restaurantRepository.findOne({
      where: { slug },
    });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create restaurant
    const restaurant = this.restaurantRepository.create({
      ...dto,
      slug,
      ownerId,
      isActive: true, // Default to active
    });

    try {
      const savedRestaurant = await this.restaurantRepository.save(restaurant);

      // Update user role if needed
      await this.userRepository.update(ownerId, { role: 'restaurant' });

      return RestaurantResponseDto.fromEntity(savedRestaurant);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create restaurant');
    }
  }
}
