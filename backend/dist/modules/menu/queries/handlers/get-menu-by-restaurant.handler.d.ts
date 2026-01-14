import { IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Category } from '../../../../domain/entities';
import { CategoryWithItemsDto } from '../../dto';
import { GetMenuByRestaurantQuery } from '../index';
export declare class GetMenuByRestaurantHandler implements IQueryHandler<GetMenuByRestaurantQuery> {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    execute(query: GetMenuByRestaurantQuery): Promise<CategoryWithItemsDto[]>;
}
