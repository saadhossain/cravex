import { LoginDto, RegisterDto } from '../dto';

export class RegisterUserCommand {
  constructor(public readonly dto: RegisterDto) {}
}

export class LoginUserCommand {
  constructor(public readonly dto: LoginDto) {}
}

export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}

export class LogoutUserCommand {
  constructor(public readonly userId: string) {}
}
