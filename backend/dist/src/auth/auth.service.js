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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const { password: _, ...result } = user.toObject();
        return result;
    }
    async login(user) {
        const payload = { email: user.email, sub: user._id };
        const accessToken = this.jwtService.sign(payload, {
            secret: 'your_secret_key',
            expiresIn: '2h',
        });
        return {
            result: {
                access_token: accessToken,
                isVerified: user.isVerified,
                ...payload,
            },
            status: 200,
        };
    }
    async signup(createUserDto) {
        const { email, password, fullname } = createUserDto;
        const existingUser = await this.usersService.findUserByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const newUser = await this.usersService.createUser(email, password, fullname);
        const payload = { email: newUser.email, sub: newUser._id };
        const accessToken = this.jwtService.sign(payload, {
            secret: 'your_secret_key',
            expiresIn: '2h',
        });
        return {
            result: { access_token: accessToken },
            status: 201,
        };
    }
    async verifyEmail(user, code) {
        try {
            const currentUser = await this.usersService.findUserByEmail(user.email);
            if (!currentUser) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (code !== currentUser.verificationCode) {
                throw new common_1.HttpException('Invalid verification code', common_1.HttpStatus.BAD_REQUEST);
            }
            currentUser.isVerified = true;
            currentUser.verificationCode = '';
            await currentUser.save();
            const payload = { email: currentUser.email, sub: currentUser._id };
            const accessToken = this.jwtService.sign(payload, {
                secret: 'your_secret_key',
                expiresIn: '2h',
            });
            return { access_token: accessToken };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Email verification failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateRefreshToken(user) {
        const payload = { email: user.email, sub: user._id };
        return this.jwtService.sign(payload, {
            secret: 'your_secret_key',
            expiresIn: '7d',
        });
    }
    async validateRefreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: 'your_secret_key',
            });
            return { email: payload.email, sub: payload.sub };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async updateUser(userId, updateUserDto) {
        const user = await this.usersService.updateUser(userId, updateUserDto);
        return user.save();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map