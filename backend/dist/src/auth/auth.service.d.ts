import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from '@/users/dto/update-user-dto';
import { UserDocument } from '@/users/schemas/user.schema';
import { ForgotPasswordDto } from './dto/forgot-password-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        result: {
            email: any;
            sub: any;
            access: boolean;
            access_token: string;
            isVerified: any;
        };
        status: number;
    }>;
    resetPassword(payload: ResetPasswordDto, user: {
        email: string;
    }): Promise<{
        result: {
            success: boolean;
        };
        status: number;
    }>;
    signup(createUserDto: CreateUserDto): Promise<{
        result: {
            access_token: string;
            id: unknown;
        };
        status: number;
    }>;
    forgotPassword(forgotPassword: ForgotPasswordDto): Promise<{
        result: {
            access_token: string;
        };
        status: number;
    }>;
    verifyEmail(user: any, code: string): Promise<{
        access_token: string;
        verifiedUser: boolean;
    }>;
    generateRefreshToken(user: any): Promise<string>;
    validateRefreshToken(refreshToken: string): Promise<{
        email: any;
        sub: any;
    }>;
    updateUser(userId: string, updateUserDto: Partial<UpdateUserDto>): Promise<UserDocument>;
}
