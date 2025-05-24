import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarSchema } from './schemas/calendar.schema';
import { EventSchema } from './schemas/event.schema'; // Import the Event schema
import { VersionHistorySchema } from './schemas/versionhistory.schema';
import { CollaboratorSchema } from './schemas/collaborator.schema';
import { FeedbackSchema } from './schemas/feedback.schema';
import { UserSchema } from 'src/users/schemas/user.schema';
import { JobSchema } from './schemas/job.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { CloudinaryService } from 'src/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Calendar', schema: CalendarSchema },
      { name: 'Collaborator', schema: CollaboratorSchema },
      { name: 'Job', schema: JobSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Event', schema: EventSchema }, // Register the Event schema
      { name: 'VersionHistory', schema: VersionHistorySchema },
      { name: 'Collaborator', schema: CollaboratorSchema },
      { name: 'Feedback', schema: FeedbackSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Replace with environment variable
      signOptions: { expiresIn: '2h' }, // Token expiration time
    }),
  ],
  controllers: [CalendarController],
  providers: [CalendarService, JwtStrategy, CloudinaryService],
  exports: [CalendarService],
})
export class CalendarModule {}
