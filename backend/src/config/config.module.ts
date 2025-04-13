import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available globally
      envFilePath: '.env', // Load environment variables from .env file
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class AppConfigModule {}
