import { Category, MenuItem, MenuOption, MenuOptionGroup } from 'src/domain/entities';
export declare class MenuOptionResponseDto {
    id: string;
    name: string;
    additionalPrice: number;
    isAvailable: boolean;
    isDefault: boolean;
    static fromEntity(entity: MenuOption): MenuOptionResponseDto;
}
export declare class MenuOptionGroupResponseDto {
    id: string;
    name: string;
    selectionType: 'single' | 'multiple';
    minSelections: number;
    maxSelections: number;
    freeSelections: number;
    isRequired: boolean;
    options: MenuOptionResponseDto[];
    static fromEntity(entity: MenuOptionGroup): MenuOptionGroupResponseDto;
}
export declare class MenuItemResponseDto {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    isPopular: boolean;
    isVegetarian: boolean;
    isVegan: boolean;
    isSpicy: boolean;
    spicyLevel: number;
    tags: string[];
    optionGroups: MenuOptionGroupResponseDto[];
    static fromEntity(entity: MenuItem): MenuItemResponseDto;
}
export declare class CategoryWithItemsDto {
    id: string;
    name: string;
    slug: string;
    displayOrder: number;
    items: MenuItemResponseDto[];
    static fromEntity(entity: Category): CategoryWithItemsDto;
}
