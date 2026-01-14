import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateTokens(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyRefreshToken(token: string): Promise<JwtPayload | null>;
}
