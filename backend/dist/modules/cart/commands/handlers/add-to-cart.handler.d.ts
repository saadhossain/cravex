import { ICommandHandler } from '@nestjs/cqrs';
import { DataSource, Repository } from 'typeorm';
import { Cart, MenuItem, MenuOption } from '../../../../domain/entities';
import { CartResponseDto } from '../../dto';
import { AddToCartCommand } from '../index';
export declare class AddToCartHandler implements ICommandHandler<AddToCartCommand> {
    private readonly cartRepository;
    private readonly menuItemRepository;
    private readonly menuOptionRepository;
    private readonly dataSource;
    constructor(cartRepository: Repository<Cart>, menuItemRepository: Repository<MenuItem>, menuOptionRepository: Repository<MenuOption>, dataSource: DataSource);
    execute(command: AddToCartCommand): Promise<CartResponseDto>;
}
