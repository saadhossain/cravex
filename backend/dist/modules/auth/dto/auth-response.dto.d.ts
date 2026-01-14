import { User } from '../../../domain/entities';
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: string;
    avatarUrl: string | null;
    isEmailVerified: boolean;
    createdAt: Date;
    static fromEntity(user: User): UserResponseDto;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
}
export declare class TokenResponseDto {
    accessToken: string;
    refreshToken: string;
}
