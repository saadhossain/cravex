import { CreateCategoryDto, CreateMenuItemDto, UpdateCategoryDto, UpdateMenuItemDto } from '../dto';
export declare class CreateCategoryCommand {
    readonly ownerId: string;
    readonly dto: CreateCategoryDto;
    constructor(ownerId: string, dto: CreateCategoryDto);
}
export declare class UpdateCategoryCommand {
    readonly ownerId: string;
    readonly categoryId: string;
    readonly dto: UpdateCategoryDto;
    constructor(ownerId: string, categoryId: string, dto: UpdateCategoryDto);
}
export declare class CreateMenuItemCommand {
    readonly ownerId: string;
    readonly dto: CreateMenuItemDto;
    constructor(ownerId: string, dto: CreateMenuItemDto);
}
export declare class UpdateMenuItemCommand {
    readonly ownerId: string;
    readonly menuItemId: string;
    readonly dto: UpdateMenuItemDto;
    constructor(ownerId: string, menuItemId: string, dto: UpdateMenuItemDto);
}
