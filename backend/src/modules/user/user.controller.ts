import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import {
  AdminUsersQueryDto,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserStatusDto,
} from './dto';
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

  @Get('admin/:id')
  @ApiOperation({ summary: 'Get a single user by ID (admin)' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post('admin')
  @ApiOperation({ summary: 'Create a new user (admin)' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch('admin/:id')
  @ApiOperation({ summary: 'Update a user (admin)' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete a user (admin)' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
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
