import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Category, Restaurant } from '../../../../domain/entities';
import { CreateCategoryCommand } from '../index';
export declare class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
    private readonly categoryRepository;
    private readonly restaurantRepository;
    constructor(categoryRepository: Repository<Category>, restaurantRepository: Repository<Restaurant>);
    execute(command: CreateCategoryCommand): Promise<any>;
}
