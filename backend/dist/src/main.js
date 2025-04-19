"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require("express");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://your-frontend-domain.com',
            process.env.FRONTEND_URL,
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.setGlobalPrefix('backend');
    app.use(cookieParser());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/backend`);
}
bootstrap();
//# sourceMappingURL=main.js.map