import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        data: {
            access_token: string;
        };
        status: HttpStatus;
    }>;
    verifyEmail(req: any, body: {
        code: string;
    }): Promise<{
        success: boolean;
        data: {
            access_token: string;
        };
        status: HttpStatus;
    }>;
    login(req: any): Promise<{
        result: any;
        status: any;
    }>;
    refreshToken(authHeader: string): Promise<{
        result: {
            email: any;
            sub: any;
            access_token: string;
            isVerified: any;
        };
        status: number;
    } | {
        result: string;
        status: number;
    }>;
}
