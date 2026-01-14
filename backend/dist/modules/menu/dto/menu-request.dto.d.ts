export declare class CreateCategoryDto {
    name: string;
    description?: string;
    displayOrder?: number;
}
export declare class UpdateCategoryDto extends CreateCategoryDto {
}
export declare class CreateMenuOptionDto {
    name: string;
    additionalPrice: number;
    isDefault?: boolean;
}
export declare class CreateMenuOptionGroupDto {
    name: string;
    selectionType: 'single' | 'multiple';
    minSelections: number;
    maxSelections?: number;
    freeSelections: number;
    isRequired: boolean;
    options: CreateMenuOptionDto[];
}
export declare class CreateMenuItemDto {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isSpicy?: boolean;
    spicyLevel?: number;
    calories?: number;
    allergens?: string[];
    tags?: string[];
    optionGroups?: CreateMenuOptionGroupDto[];
}
export declare class UpdateMenuItemDto extends CreateMenuItemDto {
}
