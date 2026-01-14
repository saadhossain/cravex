import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { CategoryWithItemsDto, CreateCategoryDto, CreateMenuItemDto } from './dto';
export declare class MenuController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    createCategory(user: User, dto: CreateCategoryDto): Promise<any>;
    createMenuItem(user: User, dto: CreateMenuItemDto): Promise<any>;
    getMenu(restaurantId: string): Promise<CategoryWithItemsDto[]>;
}
