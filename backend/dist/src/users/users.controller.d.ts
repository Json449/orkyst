import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        result: import("./schemas/user.schema").UserDocument | null;
        status: number;
    }>;
}
