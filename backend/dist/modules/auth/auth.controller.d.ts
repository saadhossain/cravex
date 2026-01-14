import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../domain/entities';
import { AuthResponseDto, LoginDto, RefreshTokenDto, RegisterDto, UserResponseDto } from './dto';
export declare class AuthController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    refresh(dto: RefreshTokenDto): Promise<any>;
    logout(user: User): Promise<{
        message: string;
    }>;
    getCurrentUser(user: User): Promise<UserResponseDto>;
}
