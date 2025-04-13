import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user-dto';
import { CalendarService } from 'src/calendar/calendar.service';
import { MailService } from 'src/mail.service';
export declare class UsersService {
    private readonly userModel;
    private readonly calendarService;
    private readonly mailService;
    constructor(userModel: Model<UserDocument>, calendarService: CalendarService, mailService: MailService);
    generateVerificationCode: () => string;
    createUser(email: string, password: string, fullname: string): Promise<UserDocument>;
    findUserByEmail(email: string): Promise<UserDocument | null>;
    findUserById(id: string): Promise<UserDocument | null>;
    updateUser(userId: string, updateUserDto: Partial<UpdateUserDto>): Promise<UserDocument>;
}
