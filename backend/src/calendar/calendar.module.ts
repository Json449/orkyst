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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Calendar', schema: CalendarSchema },
      { name: 'Collaborator', schema: CollaboratorSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Event', schema: EventSchema }, // Register the Event schema
      { name: 'VersionHistory', schema: VersionHistorySchema },
      { name: 'Collaborator', schema: CollaboratorSchema },
      { name: 'Feedback', schema: FeedbackSchema },
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
