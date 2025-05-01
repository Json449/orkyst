// src/users/users.controller.ts
import { Controller, Body, UseGuards, Get, Request, Put } from '@nestjs/common';
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
  @Put('update_user')
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user?.userId;
    const jobId = await this.usersService.updateUser(userId, updateUserDto);
    return {
      message: 'Job Created successfully',
      status: 200,
      result: jobId,
    };
  }
}
