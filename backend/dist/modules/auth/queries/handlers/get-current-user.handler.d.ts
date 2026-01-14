import { IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities';
import { UserResponseDto } from '../../dto';
import { GetCurrentUserQuery } from '../index';
export declare class GetCurrentUserHandler implements IQueryHandler<GetCurrentUserQuery> {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    execute(query: GetCurrentUserQuery): Promise<UserResponseDto>;
}
