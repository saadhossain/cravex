import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { CartItem } from '../../../../domain/entities';
import { RemoveCartItemCommand } from '../index';
export declare class RemoveCartItemHandler implements ICommandHandler<RemoveCartItemCommand> {
    private readonly cartItemRepository;
    constructor(cartItemRepository: Repository<CartItem>);
    execute(command: RemoveCartItemCommand): Promise<void>;
}
