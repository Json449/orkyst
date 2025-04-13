import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CalendarModule } from './calendar/calendar.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sarfarazahmedkhankhan:oZFtz2BTpAjsl6L3@ai-calendar-tool.0yuac.mongodb.net/?retryWrites=true&w=majority&appName=Ai-Calendar-tool',
    ), // Change to your DB connection
    AuthModule,
    UsersModule,
    CalendarModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
