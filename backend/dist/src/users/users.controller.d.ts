import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        result: import("./schemas/user.schema").UserDocument | null;
        status: number;
    }>;
    updateUser(req: any, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        status: number;
        result: import("./schemas/user.schema").UserDocument;
    }>;
}
