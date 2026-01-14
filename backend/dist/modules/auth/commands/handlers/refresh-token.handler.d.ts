import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities';
import { AuthService } from '../../auth.service';
import { TokenResponseDto } from '../../dto';
import { RefreshTokenCommand } from '../index';
export declare class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: Repository<User>, authService: AuthService);
    execute(command: RefreshTokenCommand): Promise<TokenResponseDto>;
}
