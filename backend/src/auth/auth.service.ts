import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from '@/users/dto/update-user-dto';
import { UserDocument } from '@/users/schemas/user.schema';
import { ForgotPasswordDto } from './dto/forgot-password-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate the user's credentials (email and password)
  async validateUser(email: string, password: string): Promise<any> {
    // Step 1: Find the user by email
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Step 2: Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Step 3: Return the user object without the password
    const { password: _, ...result } = user.toObject();
    return result;
  }

  // Generate the JWT token for the authenticated user
  async login(user: any) {
    const payload = { email: user.email, sub: user._id, access: true }; // JWT payload
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '2h', // Access token expires in 2 hours
    });
    return {
      result: {
        access_token: accessToken,
        isVerified: user.isVerified,
        ...payload,
      }, // Return the access token
      status: 200, // Status code for successful login
    };
  }

  async resetPassword(payload: ResetPasswordDto, user: { email: string }) {
    const { newPassword } = payload;
    // Step 1: Check if the user already exists
    const existingUser = await this.usersService.findUserByEmail(user.email);
    if (!existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return {
      result: { success: true },
      status: 200, // Status code for successful creation
    };
  }

  // Handle user signup
  async signup(createUserDto: CreateUserDto) {
    const { email, password, fullname } = createUserDto;

    // Step 1: Check if the user already exists
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Step 2: Create the user
    const newUser = await this.usersService.createUser(
      email,
      password,
      fullname,
    );

    // Step 3: Generate the JWT token for the new user
    const payload = { email: newUser.email, sub: newUser._id, access: false }; // JWT payload
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY, // Ensure this matches the secret in the strategy
      expiresIn: '2h', // Access token expires in 2 hours
    });
    return {
      result: { access_token: accessToken, id: newUser._id }, // Return the access token
      status: 201, // Status code for successful creation
    };
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    try {
      const { email } = forgotPassword;
      const existingUser = await this.usersService.forgotPassword(email);
      const payload = {
        email: existingUser.email,
        sub: existingUser._id,
        access: false,
      }; // JWT payload
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY, // Ensure this matches the secret in the strategy
        expiresIn: '2h', // Access token expires in 2 hours
      });
      return {
        result: { access_token: accessToken }, // Return the access token
        status: 201, // Status code for successful creation
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyEmail(
    user: any,
    code: string,
  ): Promise<{ access_token: string; verifiedUser: boolean }> {
    try {
      const currentUser = await this.usersService.findUserByEmail(user.email);
      if (!currentUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      console.log('currentUser', currentUser);
      // Check if code matches
      if (code !== currentUser.verificationCode) {
        throw new HttpException(
          'Invalid verification code',
          HttpStatus.BAD_REQUEST,
        );
      }
      const verifiedUser = currentUser.isVerified ?? false;

      currentUser.isVerified = true;
      currentUser.verificationCode = '';
      await currentUser.save();

      // Generate new JWT token
      const payload = {
        email: currentUser.email,
        sub: currentUser._id,
        access: false,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '2h', // Access token expires in 2 hours
      });
      return { access_token: accessToken, verifiedUser: verifiedUser };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Email verification failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Generate a refresh token
  async generateRefreshToken(user: any) {
    const payload = { email: user.email, sub: user._id, access: false }; // JWT payload
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '7d', // Refresh token expires in 7 days
    });
  }

  // Validate a refresh token
  async validateRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return { email: payload.email, sub: payload.sub }; // Return the user payload
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserDocument> {
    const user = await this.usersService.updateUser(userId, updateUserDto);
    return user.save();
  }
}
