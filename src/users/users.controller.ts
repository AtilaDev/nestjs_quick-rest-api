import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

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
}
