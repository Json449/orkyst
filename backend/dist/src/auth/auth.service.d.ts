import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from '@/users/dto/update-user-dto';
import { UserDocument } from '@/users/schemas/user.schema';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        result: {
            email: any;
            sub: any;
            access_token: string;
            isVerified: any;
        };
        status: number;
    }>;
    signup(createUserDto: CreateUserDto): Promise<{
        result: {
            access_token: string;
        };
        status: number;
    }>;
    verifyEmail(user: any, code: string): Promise<{
        access_token: string;
    }>;
    generateRefreshToken(user: any): Promise<string>;
    validateRefreshToken(refreshToken: string): Promise<{
        email: any;
        sub: any;
    }>;
    updateUser(userId: string, updateUserDto: Partial<UpdateUserDto>): Promise<UserDocument>;
}
