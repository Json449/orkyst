// src/users/users.controller.ts
import {
  Controller,
  Body,
  UseGuards,
  Get,
  Request,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const email = req.user.email;
    let resposne = await this.usersService.findUserByEmail(email);
    return {
      result: resposne,
      status: 200,
    };
  }

  @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  @Patch('update_user')
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    console.log('fetched', updateUserDto);
    const userId = req.user?.userId;
    const updatedUser = await this.usersService.updateUser(
      userId,
      updateUserDto,
    );
    return {
      message: 'User updated successfully',
      status: 200,
      result: updatedUser,
    };
  }
}
