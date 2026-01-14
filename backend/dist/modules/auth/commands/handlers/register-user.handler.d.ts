import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities';
import { AuthService } from '../../auth.service';
import { AuthResponseDto } from '../../dto';
import { RegisterUserCommand } from '../index';
export declare class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: Repository<User>, authService: AuthService);
    execute(command: RegisterUserCommand): Promise<AuthResponseDto>;
}
