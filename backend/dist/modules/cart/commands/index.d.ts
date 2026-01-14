import { AddToCartDto, UpdateCartItemDto } from '../dto';
export declare class AddToCartCommand {
    readonly userId: string;
    readonly dto: AddToCartDto;
    constructor(userId: string, dto: AddToCartDto);
}
export declare class UpdateCartItemCommand {
    readonly userId: string;
    readonly cartItemId: string;
    readonly dto: UpdateCartItemDto;
    constructor(userId: string, cartItemId: string, dto: UpdateCartItemDto);
}
export declare class RemoveCartItemCommand {
    readonly userId: string;
    readonly cartItemId: string;
    constructor(userId: string, cartItemId: string);
}
export declare class ClearCartCommand {
    readonly userId: string;
    constructor(userId: string);
}
