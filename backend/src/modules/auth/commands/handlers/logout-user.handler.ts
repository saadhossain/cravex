import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities';
import { LogoutUserCommand } from '../index';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    const { userId } = command;

    // Clear refresh token
    await this.userRepository.update(userId, {
      refreshToken: null as unknown as string,
    });
  }
}
