import { IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Cart } from '../../../../domain/entities';
import { CartResponseDto } from '../../dto';
import { GetCartQuery } from '../index';
export declare class GetCartHandler implements IQueryHandler<GetCartQuery> {
    private readonly cartRepository;
    constructor(cartRepository: Repository<Cart>);
    execute(query: GetCartQuery): Promise<CartResponseDto | null>;
}
