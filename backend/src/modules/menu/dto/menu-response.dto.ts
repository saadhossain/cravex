import { ApiProperty } from '@nestjs/swagger';
import {
  Category,
  MenuItem,
  MenuOption,
  MenuOptionGroup,
} from 'src/domain/entities';

export class MenuOptionResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the option',
  })
  id: string;

  @ApiProperty({
    example: 'Extra Cheese',
    description: 'The name of the option',
  })
  name: string;

  @ApiProperty({ example: 1.5, description: 'The additional price' })
  additionalPrice: number;

  @ApiProperty({
    example: true,
    description: 'Whether the option is available',
  })
  isAvailable: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the option is selected by default',
  })
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
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the option group',
  })
  id: string;

  @ApiProperty({
    example: 'Toppings',
    description: 'The name of the option group',
  })
  name: string;

  @ApiProperty({
    enum: ['single', 'multiple'],
    example: 'multiple',
    description: 'The selection type',
  })
  selectionType: 'single' | 'multiple';

  @ApiProperty({ example: 0, description: 'The minimum selections required' })
  minSelections: number;

  @ApiProperty({ example: 5, description: 'The maximum selections allowed' })
  maxSelections: number;

  @ApiProperty({ example: 0, description: 'The number of free selections' })
  freeSelections: number;

  @ApiProperty({
    example: false,
    description: 'Whether a selection is required',
  })
  isRequired: boolean;

  @ApiProperty({
    type: [MenuOptionResponseDto],
    description: 'The options in the group',
  })
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
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the menu item',
  })
  id: string;

  @ApiProperty({
    example: 'Cheeseburger',
    description: 'The name of the menu item',
  })
  name: string;

  @ApiProperty({
    example: 'A delicious burger',
    description: 'The description',
  })
  description: string;

  @ApiProperty({ example: 12.99, description: 'The price' })
  price: number;

  @ApiProperty({
    example: 'https://example.com/burger.jpg',
    description: 'The image URL',
  })
  imageUrl: string;

  @ApiProperty({ example: true, description: 'Whether the item is available' })
  isAvailable: boolean;

  @ApiProperty({ example: true, description: 'Whether the item is popular' })
  isPopular: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the item is vegetarian',
  })
  isVegetarian: boolean;

  @ApiProperty({ example: false, description: 'Whether the item is vegan' })
  isVegan: boolean;

  @ApiProperty({ example: false, description: 'Whether the item is spicy' })
  isSpicy: boolean;

  @ApiProperty({ example: 0, description: 'The spicy level' })
  spicyLevel: number;

  @ApiProperty({ example: ['Bestseller'], description: 'Tags' })
  tags: string[];

  @ApiProperty({
    type: [MenuOptionGroupResponseDto],
    description: 'The option groups',
  })
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
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the category',
  })
  id: string;

  @ApiProperty({ example: 'Burgers', description: 'The name of the category' })
  name: string;

  @ApiProperty({ example: 'burgers', description: 'The slug of the category' })
  slug: string;

  @ApiProperty({ example: 1, description: 'The display order' })
  displayOrder: number;

  @ApiProperty({
    type: [MenuItemResponseDto],
    description: 'The items in the category',
  })
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
