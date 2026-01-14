"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenResponseDto = exports.AuthResponseDto = exports.UserResponseDto = void 0;
class UserResponseDto {
    id;
    email;
    firstName;
    lastName;
    phone;
    role;
    avatarUrl;
    isEmailVerified;
    createdAt;
    static fromEntity(user) {
        const dto = new UserResponseDto();
        dto.id = user.id;
        dto.email = user.email;
        dto.firstName = user.firstName;
        dto.lastName = user.lastName;
        dto.phone = user.phone;
        dto.role = user.role;
        dto.avatarUrl = user.avatarUrl;
        dto.isEmailVerified = user.isEmailVerified;
        dto.createdAt = user.createdAt;
        return dto;
    }
}
exports.UserResponseDto = UserResponseDto;
class AuthResponseDto {
    accessToken;
    refreshToken;
    user;
}
exports.AuthResponseDto = AuthResponseDto;
class TokenResponseDto {
    accessToken;
    refreshToken;
}
exports.TokenResponseDto = TokenResponseDto;
//# sourceMappingURL=auth-response.dto.js.map