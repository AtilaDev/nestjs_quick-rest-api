import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    console.log('id controller', id);
    return this.usersService.getUserById(id);
  }

  // @Get('email/:email')
  // getUserByEmail(@Param('email') email: string) {
  //   return this.usersService.getUserByEmail(email);
  // }
}
