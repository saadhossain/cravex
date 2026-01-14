import { AddToCartDto, UpdateCartItemDto } from '../dto';

export class AddToCartCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: AddToCartDto,
  ) {}
}

export class UpdateCartItemCommand {
  constructor(
    public readonly userId: string,
    public readonly cartItemId: string,
    public readonly dto: UpdateCartItemDto,
  ) {}
}

export class RemoveCartItemCommand {
  constructor(
    public readonly userId: string,
    public readonly cartItemId: string,
  ) {}
}

export class ClearCartCommand {
  constructor(public readonly userId: string) {}
}
