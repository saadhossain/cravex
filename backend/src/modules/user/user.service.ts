import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import { User } from '../../domain/entities/user.entity';
import { AdminUsersQueryDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async getUsersAdmin(query: AdminUsersQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.andWhere("user.role != 'superadmin'");

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    const validSortFields = ['createdAt', 'firstName', 'lastName', 'email'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`user.${sortField}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users.map((user) => {
        const { password, refreshToken, ...result } = user;
        return result;
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(id: string, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;
    await this.userRepository.save(user);

    if (user.role === 'restaurant') {
      const restaurant = await this.restaurantRepository.findOne({
        where: { ownerId: user.id },
      });
      if (restaurant) {
        restaurant.isActive = isActive;
        await this.restaurantRepository.save(restaurant);
      }
    }

    return { message: 'User status updated successfully' };
  }
}
