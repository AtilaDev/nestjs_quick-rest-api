import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  getUsers(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit) : undefined;
    return this.usersService.getUsers(limitNumber);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, description: 'Return user by email' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created',
  })
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete entire db' })
  @ApiResponse({
    status: 200,
    description: 'All users have been successfully deleted',
  })
  deleteDB() {
    return this.usersService.deleteDB();
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete an user by email' })
  @ApiResponse({
    status: 200,
    description: 'The user has been deleted',
  })
  deleteUserByEmail(@Param('email') email: string) {
    return this.usersService.deleteUserByEmail(email);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user by email' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
  })
  updateUsernameByEmail(
    @Query('email') email: string,
    @Query('username') username: string,
  ) {
    return this.usersService.updateUsernameByEmail(email, username);
  }
}
