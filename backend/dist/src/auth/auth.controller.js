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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const create_user_dto_1 = require("./dto/create-user-dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const forgot_password_dto_1 = require("./dto/forgot-password-dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(createUserDto) {
        try {
            const response = await this.authService.signup(createUserDto);
            return {
                success: true,
                ...response.result,
                status: common_1.HttpStatus.CREATED,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Verification failed',
                status: error.status || common_1.HttpStatus.BAD_REQUEST,
            }, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async forgotPassword(forgotPassword) {
        try {
            const response = await this.authService.forgotPassword(forgotPassword);
            return {
                success: true,
                access_token: response?.result.access_token,
                status: common_1.HttpStatus.OK,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                error: error.message,
                status: error.status || common_1.HttpStatus.BAD_REQUEST,
            }, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verifyEmail(req, body) {
        try {
            const response = await this.authService.verifyEmail(req.user, body.code);
            console.log('response', response);
            return {
                success: true,
                access_token: response.access_token,
                verifiedUser: response.verifiedUser,
                status: common_1.HttpStatus.OK,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Verification failed',
                status: error.status || common_1.HttpStatus.BAD_REQUEST,
            }, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(req) {
        try {
            const loginResponse = await this.authService.login(req.user);
            return {
                result: loginResponse.result,
                status: loginResponse.status,
            };
        }
        catch (error) {
            return {
                result: error.response?.data || { error: 'Unknown error occurred' },
                status: error.status || 500,
            };
        }
    }
    async resetPassword(req, payload) {
        try {
            const loginResponse = await this.authService.resetPassword(payload, req.user);
            return {
                result: loginResponse.result,
                status: loginResponse.status,
            };
        }
        catch (error) {
            return {
                result: error.response?.data || { error: 'Unknown error occurred' },
                status: error.status || 500,
            };
        }
    }
    async refreshToken(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('No refresh token provided');
        }
        const refreshToken = authHeader.split(' ')[1];
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('No refresh token provided');
        }
        try {
            const user = await this.authService.validateRefreshToken(refreshToken);
            const newAccessToken = await this.authService.login(user);
            return {
                result: newAccessToken.result,
                status: 200,
            };
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                return {
                    result: 'Refresh token expired',
                    status: 401,
                };
            }
            return {
                result: 'Invalid refresh token',
                status: 401,
            };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map