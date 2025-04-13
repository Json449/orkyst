import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; // To use express for custom body-parser configuration
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Custom configuration for body parser (allow large payloads, e.g., for file uploads)
  app.use(
    express.json({ limit: '50mb' }), // Increase this limit as needed (50mb is an example)
  );
  app.use(
    express.urlencoded({ limit: '50mb', extended: true }), // Allow large payloads for URL-encoded data
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Set the port dynamically using environment variable, fallback to 3000
  const port = process.env.PORT || 3000;

  // Start the server
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
