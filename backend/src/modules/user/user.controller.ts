import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { AdminUsersQueryDto, UpdateUserStatusDto } from './dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/all')
  @ApiOperation({ summary: 'Get all users with filtering (admin)' })
  async getUsersAdmin(@Query() query: AdminUsersQueryDto) {
    return this.userService.getUsersAdmin(query);
  }

  @Patch('admin/:id/status')
  @ApiOperation({ summary: 'Update user status (activate/deactivate)' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.userService.updateUserStatus(id, updateStatusDto.isActive);
  }
}
