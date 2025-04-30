"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const calendar_service_1 = require("../calendar/calendar.service");
const mail_service_1 = require("../mail.service");
let UsersService = class UsersService {
    constructor(userModel, calendarService, mailService) {
        this.userModel = userModel;
        this.calendarService = calendarService;
        this.mailService = mailService;
        this.generateVerificationCode = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };
    }
    async createUser(email, password, fullname) {
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const verificationCode = this.generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
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
    async findUserByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findUserById(id) {
        return this.userModel.findById(id).exec();
    }
    async updateUser(userId, updateUserDto) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const result = await this.calendarService.generateCalendar(updateUserDto.calendarInputs, userId);
        console.log('check now', result);
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        calendar_service_1.CalendarService,
        mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map