import { ICommandHandler } from '@nestjs/cqrs';
import { DataSource, Repository } from 'typeorm';
import { Category, MenuItem, Restaurant } from '../../../../domain/entities';
import { MenuItemResponseDto } from '../../dto';
import { CreateMenuItemCommand } from '../index';
export declare class CreateMenuItemHandler implements ICommandHandler<CreateMenuItemCommand> {
    private readonly menuItemRepository;
    private readonly categoryRepository;
    private readonly restaurantRepository;
    private readonly dataSource;
    constructor(menuItemRepository: Repository<MenuItem>, categoryRepository: Repository<Category>, restaurantRepository: Repository<Restaurant>, dataSource: DataSource);
    execute(command: CreateMenuItemCommand): Promise<MenuItemResponseDto>;
}
