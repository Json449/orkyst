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
}
