import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities';
import { LogoutUserCommand } from '../index';
export declare class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    execute(command: LogoutUserCommand): Promise<void>;
}
