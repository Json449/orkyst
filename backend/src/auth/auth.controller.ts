import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  UnauthorizedException,
  Headers,
  HttpStatus,
  HttpException,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from './dto/create-user-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto } from '@/users/dto/update-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Handle signup
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const response = await this.authService.signup(createUserDto);
      return {
        success: true,
        data: {
          access_token: response?.result.access_token,
        },
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Verification failed',
          status: error.status || HttpStatus.BAD_REQUEST,
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  async verifyEmail(@Request() req, @Body() body: { code: string }) {
    try {
      const response = await this.authService.verifyEmail(req.user, body.code);
      return {
        success: true,
        data: {
          access_token: response.access_token,
        },
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(':asdasdsad', error);
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Verification failed',
          status: error.status || HttpStatus.BAD_REQUEST,
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Handle login with the LocalAuthGuard
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      const loginResponse = await this.authService.login(req.user);
      return {
        result: loginResponse.result, // Send the access token in 'data'
        status: loginResponse.status, // Return the status code
      };
    } catch (error) {
      // If error occurs, handle it gracefully
      return {
        result: error.response?.data || { error: 'Unknown error occurred' },
        status: error.status || 500,
      };
    }
  }

  // Handle refresh token using Authorization header
  @Post('refresh-token')
  async refreshToken(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const refreshToken = authHeader.split(' ')[1]; // Extract the token from the header
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      // Validate the refresh token
      const user = await this.authService.validateRefreshToken(refreshToken);

      // Generate a new access token
      const newAccessToken = await this.authService.login(user);

      return {
        result: newAccessToken.result, // Return the new access token
        status: 200,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          result: 'Refresh token expired',
          status: 401,
        };
      }
      return {
        result: 'Invalid refresh token',
        status: 401,
      };
    }
  }

  @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  @Patch('update_user')
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    console.log('fetched', updateUserDto);
    const userId = req.user?.userId;
    const updatedUser = await this.authService.updateUser(
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
