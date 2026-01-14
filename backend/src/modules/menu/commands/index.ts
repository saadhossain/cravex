import {
  CreateCategoryDto,
  CreateMenuItemDto,
  UpdateCategoryDto,
  UpdateMenuItemDto,
} from '../dto';

export class CreateCategoryCommand {
  constructor(
    public readonly ownerId: string,
    public readonly dto: CreateCategoryDto,
  ) {}
}

export class UpdateCategoryCommand {
  constructor(
    public readonly ownerId: string,
    public readonly categoryId: string,
    public readonly dto: UpdateCategoryDto,
  ) {}
}

export class CreateMenuItemCommand {
  constructor(
    public readonly ownerId: string,
    public readonly dto: CreateMenuItemDto,
  ) {}
}

export class UpdateMenuItemCommand {
  constructor(
    public readonly ownerId: string,
    public readonly menuItemId: string,
    public readonly dto: UpdateMenuItemDto,
  ) {}
}
