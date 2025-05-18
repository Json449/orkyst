import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { ForgotPasswordDto } from './dto/forgot-password-dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(createUserDto: CreateUserDto): Promise<{
        status: HttpStatus;
        access_token: string;
        id: unknown;
        success: boolean;
    }>;
    forgotPassword(forgotPassword: ForgotPasswordDto): Promise<{
        success: boolean;
        access_token: string;
        status: HttpStatus;
    }>;
    verifyEmail(req: any, body: {
        code: string;
    }): Promise<{
        success: boolean;
        access_token: string;
        verifiedUser: boolean;
        status: HttpStatus;
    }>;
    login(req: any): Promise<{
        result: any;
        status: any;
    }>;
    resetPassword(req: any, payload: any): Promise<{
        result: any;
        status: any;
    }>;
    refreshToken(authHeader: string): Promise<{
        result: {
            email: any;
            sub: any;
            access: boolean;
            access_token: string;
            isVerified: any;
        };
        status: number;
    } | {
        result: string;
        status: number;
    }>;
}
