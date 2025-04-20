import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user-dto';
import { CalendarService } from 'src/calendar/calendar.service';
import { MailService } from 'src/mail.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly calendarService: CalendarService,
    private readonly mailService: MailService,
  ) {}

  generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  };

  async createUser(
    email: string,
    password: string,
    fullname: string,
  ): Promise<UserDocument> {
    // Check if the user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      fullname,
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });
    await this.mailService.sendVerificationEmail(email, verificationCode);
    return newUser.save();
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUser(
    userId: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const result = await this.calendarService.generateCalendar(
      updateUserDto.calendarInputs,
      userId,
    );
    console.log('check now', result);
    return await user.save();
  }
}
