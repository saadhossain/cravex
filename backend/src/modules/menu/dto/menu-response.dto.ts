import {
  Category,
  MenuItem,
  MenuOption,
  MenuOptionGroup,
} from 'src/domain/entities';

export class MenuOptionResponseDto {
  id: string;
  name: string;
  additionalPrice: number;
  isAvailable: boolean;
  isDefault: boolean;

  static fromEntity(entity: MenuOption): MenuOptionResponseDto {
    const dto = new MenuOptionResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.additionalPrice = Number(entity.additionalPrice);
    dto.isAvailable = entity.isAvailable;
    dto.isDefault = entity.isDefault;
    return dto;
  }
}

export class MenuOptionGroupResponseDto {
  id: string;
  name: string;
  selectionType: 'single' | 'multiple';
  minSelections: number;
  maxSelections: number;
  freeSelections: number;
  isRequired: boolean;
  options: MenuOptionResponseDto[];

  static fromEntity(entity: MenuOptionGroup): MenuOptionGroupResponseDto {
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

export class MenuItemResponseDto {
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

  static fromEntity(entity: MenuItem): MenuItemResponseDto {
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

export class CategoryWithItemsDto {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  items: MenuItemResponseDto[];

  static fromEntity(entity: Category): CategoryWithItemsDto {
    const dto = new CategoryWithItemsDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.slug = entity.slug;
    dto.displayOrder = entity.displayOrder;
    dto.items = entity.menuItems?.map(MenuItemResponseDto.fromEntity) || [];
    return dto;
  }
}
