import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities';
import { AuthService } from '../../auth.service';
import { AuthResponseDto } from '../../dto';
import { LoginUserCommand } from '../index';
export declare class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: Repository<User>, authService: AuthService);
    execute(command: LoginUserCommand): Promise<AuthResponseDto>;
}
