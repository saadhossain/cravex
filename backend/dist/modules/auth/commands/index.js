"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUserCommand = exports.RefreshTokenCommand = exports.LoginUserCommand = exports.RegisterUserCommand = void 0;
class RegisterUserCommand {
    dto;
    constructor(dto) {
        this.dto = dto;
    }
}
exports.RegisterUserCommand = RegisterUserCommand;
class LoginUserCommand {
    dto;
    constructor(dto) {
        this.dto = dto;
    }
}
exports.LoginUserCommand = LoginUserCommand;
class RefreshTokenCommand {
    refreshToken;
    constructor(refreshToken) {
        this.refreshToken = refreshToken;
    }
}
exports.RefreshTokenCommand = RefreshTokenCommand;
class LogoutUserCommand {
    userId;
    constructor(userId) {
        this.userId = userId;
    }
}
exports.LogoutUserCommand = LogoutUserCommand;
//# sourceMappingURL=index.js.map