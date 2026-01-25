import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import { User } from '../../domain/entities/user.entity';

interface AdminRestaurantsQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface CreateAdminRestaurantDto {
  name: string;
  address: string;
  ownerId?: string;
  newOwner?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  };
  minimumDelivery: number;
  deliveryFee: number;
  deliveryTimeMinutes: number;
  description?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
}

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getRestaurantsForFilter() {
    const restaurants = await this.restaurantRepository.find({
      where: { isActive: true },
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });
    return restaurants;
  }

  async getRestaurantsAdmin(query: AdminRestaurantsQuery) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.owner', 'owner');

    if (search) {
      queryBuilder.andWhere('restaurant.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('restaurant.isActive = :isActive', { isActive });
    }

    const validSortFields = ['createdAt', 'name', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`restaurant.${sortField}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [restaurants, total] = await queryBuilder.getManyAndCount();

    return {
      data: restaurants.map((r) => {
        if (r.owner) {
          const { password, refreshToken, ...ownerWithoutPassword } = r.owner;
          r.owner = ownerWithoutPassword as any;
        }
        return r;
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(Math.random() * 10000)
    );
  }

  async createRestaurantAdmin(dto: CreateAdminRestaurantDto) {
    const { ownerId, newOwner, ...restaurantData } = dto;

    let owner: User;

    if (newOwner) {
      const existingUser = await this.userRepository.findOne({
        where: { email: newOwner.email },
      });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(newOwner.password, 10);

      owner = this.userRepository.create({
        email: newOwner.email,
        password: hashedPassword,
        firstName: newOwner.firstName,
        lastName: newOwner.lastName,
        phone: newOwner.phone,
        role: 'restaurant',
        isActive: true,
        isEmailVerified: true,
      });

      await this.userRepository.save(owner);
    } else if (ownerId) {
      const foundOwner = await this.userRepository.findOne({
        where: { id: ownerId },
      });
      if (!foundOwner) {
        throw new NotFoundException('Owner not found');
      }
      owner = foundOwner;

      if (owner.role !== 'superadmin' && owner.role !== 'restaurant') {
        owner.role = 'restaurant';
        await this.userRepository.save(owner);
      }
    } else {
      throw new Error('Either ownerId or newOwner must be provided');
    }

    const restaurant = this.restaurantRepository.create({
      ...restaurantData,
      owner,
      ownerId: owner.id,
      slug: this.generateSlug(dto.name),
      isActive: true,
      latitude: dto.latitude,
      longitude: dto.longitude,
      logoUrl: dto.logoUrl,
    });

    return this.restaurantRepository.save(restaurant);
  }

  async updateRestaurantAdmin(
    id: string,
    dto: Partial<CreateAdminRestaurantDto>,
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const { ownerId, newOwner, ...updateData } = dto;

    Object.assign(restaurant, updateData);

    return this.restaurantRepository.save(restaurant);
  }

  async deleteRestaurant(id: string) {
    const result = await this.restaurantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Restaurant not found');
    }
    return { message: 'Restaurant deleted successfully' };
  }
}
