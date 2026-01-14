"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryWithItemsDto = exports.MenuItemResponseDto = exports.MenuOptionGroupResponseDto = exports.MenuOptionResponseDto = void 0;
class MenuOptionResponseDto {
    id;
    name;
    additionalPrice;
    isAvailable;
    isDefault;
    static fromEntity(entity) {
        const dto = new MenuOptionResponseDto();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.additionalPrice = Number(entity.additionalPrice);
        dto.isAvailable = entity.isAvailable;
        dto.isDefault = entity.isDefault;
        return dto;
    }
}
exports.MenuOptionResponseDto = MenuOptionResponseDto;
class MenuOptionGroupResponseDto {
    id;
    name;
    selectionType;
    minSelections;
    maxSelections;
    freeSelections;
    isRequired;
    options;
    static fromEntity(entity) {
        const dto = new MenuOptionGroupResponseDto();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.selectionType = entity.selectionType;
        dto.minSelections = entity.minSelections;
        dto.maxSelections = entity.maxSelections;
        dto.freeSelections = entity.freeSelections;
        dto.isRequired = entity.isRequired;
        dto.options = entity.options?.map(MenuOptionResponseDto.fromEntity) || [];
        return dto;
    }
}
exports.MenuOptionGroupResponseDto = MenuOptionGroupResponseDto;
class MenuItemResponseDto {
    id;
    name;
    description;
    price;
    imageUrl;
    isAvailable;
    isPopular;
    isVegetarian;
    isVegan;
    isSpicy;
    spicyLevel;
    tags;
    optionGroups;
    static fromEntity(entity) {
        const dto = new MenuItemResponseDto();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.description = entity.description;
        dto.price = Number(entity.price);
        dto.imageUrl = entity.imageUrl;
        dto.isAvailable = entity.isAvailable;
        dto.isPopular = entity.isPopular;
        dto.isVegetarian = entity.isVegetarian;
        dto.isVegan = entity.isVegan;
        dto.isSpicy = entity.isSpicy;
        dto.spicyLevel = entity.spicyLevel;
        dto.tags = entity.tags || [];
        dto.optionGroups =
            entity.optionGroups?.map(MenuOptionGroupResponseDto.fromEntity) || [];
        return dto;
    }
}
exports.MenuItemResponseDto = MenuItemResponseDto;
class CategoryWithItemsDto {
    id;
    name;
    slug;
    displayOrder;
    items;
    static fromEntity(entity) {
        const dto = new CategoryWithItemsDto();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.slug = entity.slug;
        dto.displayOrder = entity.displayOrder;
        dto.items = entity.menuItems?.map(MenuItemResponseDto.fromEntity) || [];
        return dto;
    }
}
exports.CategoryWithItemsDto = CategoryWithItemsDto;
//# sourceMappingURL=menu-response.dto.js.map