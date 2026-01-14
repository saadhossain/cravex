import { ICommandHandler } from '@nestjs/cqrs';
import { DataSource, Repository } from 'typeorm';
import { CartItem, MenuOption } from '../../../../domain/entities';
import { CartResponseDto } from '../../dto';
import { UpdateCartItemCommand } from '../index';
export declare class UpdateCartItemHandler implements ICommandHandler<UpdateCartItemCommand> {
    private readonly cartItemRepository;
    private readonly menuOptionRepository;
    private readonly dataSource;
    constructor(cartItemRepository: Repository<CartItem>, menuOptionRepository: Repository<MenuOption>, dataSource: DataSource);
    execute(command: UpdateCartItemCommand): Promise<CartResponseDto>;
}
