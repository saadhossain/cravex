import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { CreateRestaurantDto, PaginatedResponseDto, RestaurantDetailDto, RestaurantListQueryDto, RestaurantResponseDto, UpdateRestaurantDto } from './dto';
export declare class RestaurantController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    create(user: User, dto: CreateRestaurantDto): Promise<RestaurantResponseDto>;
    update(id: string, user: User, dto: UpdateRestaurantDto): Promise<RestaurantResponseDto>;
    findAll(query: RestaurantListQueryDto): Promise<PaginatedResponseDto<RestaurantResponseDto>>;
    findOne(slug: string): Promise<RestaurantDetailDto>;
}
