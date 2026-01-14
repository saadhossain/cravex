import { LoginDto, RegisterDto } from '../dto';
export declare class RegisterUserCommand {
    readonly dto: RegisterDto;
    constructor(dto: RegisterDto);
}
export declare class LoginUserCommand {
    readonly dto: LoginDto;
    constructor(dto: LoginDto);
}
export declare class RefreshTokenCommand {
    readonly refreshToken: string;
    constructor(refreshToken: string);
}
export declare class LogoutUserCommand {
    readonly userId: string;
    constructor(userId: string);
}
