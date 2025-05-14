import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { jsonrepair } from 'jsonrepair';
import { CalendarDocument } from './schemas/calendar.schema';
import { EventDocument } from './schemas/event.schema';
import { FeedbackDocument } from './schemas/feedback.schema';
import { AddFeedbackDto } from './dto/add-feedback-dto';
import { VersionHistory } from './schemas/versionhistory.schema';
import {
  calendarSuggestionPrompt,
  calendarSuggestionPromptv2,
  defaultPrompt,
  eventSuggestionPrompt,
  generateCalendarPrompt,
  generateCalendarPromptv1,
  generateDynamicBlogPostPrompt,
  imageGenerationPrompt,
  linkedInPrompt,
  twitterPrompt,
} from 'src/utils';
import { CollaboratorDocument } from './schemas/collaborator.schema';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JobDocument } from './schemas/job.schema';
import { v4 as uuidv4 } from 'uuid';
import { CreateEventDto } from './dto/create-event-dto';

@Injectable()
export class CalendarService {
  private openai: OpenAI;

  constructor(
    @InjectModel('Collaborator')
    private readonly collaboratorModel: Model<CollaboratorDocument>,
    @InjectModel('Calendar')
    private readonly calendarModel: Model<CalendarDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    @InjectModel('Feedback')
    private readonly feedbackModel: Model<FeedbackDocument>,
    @InjectModel('VersionHistory')
    private readonly versionModel: Model<VersionHistory>,
    @InjectModel('Job')
    private readonly jobModel: Model<JobDocument>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async getCalendarDetails(calendarId: string): Promise<CalendarDocument> {
    try {
      const data = await this.calendarModel
        .findById({ _id: calendarId })
        .populate({
          path: 'events',
          select: '-description', // Exclude 'description' while including all other fields
        })
        .populate({
          path: 'collaborators',
          select: 'name', // Exclude 'description' while including all other fields
        })
        .lean() // Return plain JavaScript objects for better performance
        .exec();
      if (data) {
        return data;
      } else {
        throw new Error('No record found');
      }
    } catch (error) {
      console.error('Error fetching calendar entries:', error);
      throw new Error('Error fetching calendar entries for the user');
    }
  }

  async addCollaborator(
    calendarId: string,
    createCollaboratorDto: CreateCollaboratorDto,
  ) {
    // Validate calendar exists
    const calendar = await this.calendarModel.findById(calendarId);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    // Verify the user exists
    const user = await this.userModel.findOne({
      email: createCollaboratorDto.email,
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if collaborator already exists for this calendar
    const existingCollaborator = await this.collaboratorModel.findOne({
      userId: user._id,
      calendarId,
    });

    if (existingCollaborator) {
      throw new Error('User is already a collaborator on this calendar');
    }

    // Create new collaborator
    const collaborator = new this.collaboratorModel({
      userId: user._id,
      email: createCollaboratorDto.email,
      name: user.fullname,
      role: createCollaboratorDto.role,
      calendarId,
    });

    // Save the collaborator first
    const savedCollaborator = await collaborator.save();

    // Update calendar's collaborators array
    await this.calendarModel.findByIdAndUpdate(
      calendarId,
      { $addToSet: { collaborators: savedCollaborator._id } },
      { new: true },
    );

    return savedCollaborator;
  }

  async getCalendarSuggestions(id: string): Promise<any> {
    const calendar = await this.calendarModel
      .findById(id)
      .populate({
        path: 'events',
        select: '-description', // Exclude 'description' while including all other fields
      })
      .exec();
    if (!calendar) {
      throw new Error('No record found');
    }
    if (calendar?.suggestions != null) {
      return JSON.parse(calendar.suggestions);
    }
    // Generate the prompt for AI tips based on the calendar data
    const prompt = calendarSuggestionPromptv2(calendar);
    try {
      // Call the OpenAI API to generate tips
      const response: any = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Use GPT-4 for better quality responses
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000, // Increase token limit for more detailed responses
        temperature: 1, // Lower temperature for more focused and precise responses
      });

      // Extract the AI-generated tips from the response
      let data: any = jsonrepair(response?.choices[0]?.message?.content);
      data = JSON.parse(data);
      let tips = data.tips;
      calendar.suggestions = JSON.stringify(tips);
      await calendar.save();
      return {
        success: true,
        tips,
      };
    } catch (error) {
      console.error('Error generating AI tips:', error);
      throw new Error('Failed to generate AI tips');
    }
  }

  async validateCalendarResponse(openAiResponse: string): Promise<any> {
    try {
      // 1. First repair the JSON if needed
      const fixedJson = jsonrepair(openAiResponse);
      // 2. Parse the JSON
      const parsedData = JSON.parse(fixedJson);

      // 3. Validate the structure
      if (
        !parsedData.month ||
        !parsedData.theme ||
        !Array.isArray(parsedData.events)
      ) {
        throw new Error('Invalid calendar data structure from OpenAI');
      }

      // 4. Validate individual events
      const isValidEvents = parsedData.events.every((event) => {
        return event.title && event.date && event.type;
      });

      if (!isValidEvents) {
        throw new Error('Some calendar events are missing required fields');
      }

      return parsedData;
    } catch (error) {
      console.error('Validation failed:', error);
      throw new Error(`Calendar validation failed: ${error.message}`);
    }
  }

  async validateCalendarEvents(response, currentYear, currentMonth) {
    return response.events.map((event: any) => {
      const eventDate = new Date(event.date);
      if (
        eventDate.getFullYear() !== currentYear ||
        eventDate.getMonth() + 1 !== currentMonth
      ) {
        // If the event date is not in the current month, adjust it to the current month
        event.date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
      }
      return event;
    });
  }

  async createEvents(events: any[], calendarId: string): Promise<any> {
    try {
      // Use Promise.all properly with async operations
      const eventCreationPromises = events.map(async (eventData) => {
        try {
          const newEvent = new this.eventModel({
            title: eventData.title,
            date: new Date(eventData.date),
            type: eventData.type,
            audienceFocus: eventData.audienceFocus,
            theme: eventData.theme,
            description: null,
            calendarId: calendarId,
          });
          const savedEvent = await newEvent.save();
          return savedEvent._id;
        } catch (eventError) {
          console.error('Error saving event:', eventData, eventError);
          throw new Error(`Failed to save event: ${eventData.title}`);
        }
      });
      return await Promise.all(eventCreationPromises);
    } catch (error) {
      console.error('Error in batch event creation:', error);
      throw new Error('Failed to create events');
    }
  }

  private async processCalendar(jobId: string) {
    try {
      const job = await this.jobModel.findOne({ jobId });
      if (!job) throw new Error('Job not found');
      // Update status to processing
      await this.updateJob(jobId, { status: 'processing', progress: 20 });
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      // Step 1: Generate prompt
      const prompt = generateCalendarPromptv1(
        job.inputs,
        currentMonth,
        currentYear,
      );
      await this.updateJob(jobId, { progress: 40 });
      // Step 2: Call OpenAI
      const response: any = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 3000, // Increase token limit for more detailed responses
        temperature: 0.5, // Lower temperature for more focused and precise responses
      });
      await this.updateJob(jobId, { progress: 50 });
      const calendarData = await this.validateCalendarResponse(
        response?.choices[0]?.message?.content,
      );
      await this.updateJob(jobId, { progress: 70 });
      const validatedEvents = await this.validateCalendarEvents(
        calendarData,
        currentYear,
        currentMonth,
      );
      calendarData.events = validatedEvents;
      calendarData.calendarInputs = job.inputs;
      calendarData.userId = job.userId;
      calendarData.suggestions = null;
      calendarData.isActive = true;
      const newCalendar: any = new this.calendarModel(calendarData);
      const eventIds = await this.createEvents(
        calendarData.events,
        newCalendar._id,
      );
      newCalendar.events = eventIds;
      await this.updateJob(jobId, { progress: 90 });
      await newCalendar.save();
      await this.updateJob(jobId, {
        status: 'completed',
        result: newCalendar,
        progress: 100,
      });
    } catch (error) {
      await this.updateJob(jobId, {
        status: 'failed',
        error: error.message,
      });
    }
  }

  private async updateJob(jobId: string, updates: Partial<JobDocument>) {
    await this.jobModel.updateOne({ jobId }, updates);
  }

  async generateCalendar(calendarInputs, userId: string): Promise<any> {
    try {
      const jobId = uuidv4();
      await this.jobModel.create({
        jobId,
        userId,
        status: 'pending',
        inputs: calendarInputs,
        progress: 0,
      });
      this.processCalendar(jobId).catch(console.error);
      return { jobId };
    } catch (error) {
      console.error('Error generating calendar:', error);
      throw new Error('Failed to generate calendar');
    }
  }

  getPrompt = (title: string, audienceFocus, theme, date, type) => {
    switch (type) {
      case 'Blog Post':
        return generateDynamicBlogPostPrompt(title, audienceFocus, theme, date);
      case 'Twiiter Post':
        return twitterPrompt(title, audienceFocus, theme, date);
      case 'LinkedIn Post':
        return linkedInPrompt(title, audienceFocus, theme, date);
      default:
        return defaultPrompt(title, audienceFocus, theme, date, type);
    }
  };

  async generateBlogPostContent(id: string) {
    const event = await this.eventModel
      .findById(id)
      .populate({
        path: 'versionHistory',
        populate: {
          path: 'updatedBy',
          select: 'fullname',
        },
      }) // Populate versionHistory (correct field name)
      .populate({
        path: 'feedback', // Populate feedback
        populate: {
          path: 'userId', // Populate the userId field inside feedback
          select: 'fullname email', // Select specific fields from the User model
        },
      })
      .exec();
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.description != null) {
      return event;
    }
    const { theme, audienceFocus, title, date, type } = event;
    const prompt = this.getPrompt(title, audienceFocus, theme, date, type);

    try {
      const response: any = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Use GPT-4 for better quality responses
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 5000, // Increase token limit for more detailed responses
        temperature: 0.1, // Lower temperature for more focused and precise responses
      });
      // Parse the OpenAI response into a JavaScript object
      let description: any = jsonrepair(response?.choices[0]?.message?.content);
      description = JSON.parse(description);
      description = description.html;
      console.log('sssss', description);
      const updatedEvent = await this.eventModel
        .findByIdAndUpdate(
          id,
          { description }, // Update the description field
          { new: true }, // Return the updated document
        )
        .exec();
      return updatedEvent;
    } catch (error) {
      console.error('Error generating calendar:', error);
      throw new Error('Failed to generate calendar');
    }
  }

  async getEventDetails(id: string) {
    try {
      const event = await this.eventModel.findById(id).exec();
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    } catch (e) {
      throw new Error('Event not found');
    }
  }

  async getCalendarList(id: string) {
    try {
      const userCollaborations = await this.collaboratorModel.find({
        userId: id,
      });
      const collaboratorIds = userCollaborations.map((c) => c._id);

      const calendars = await this.calendarModel
        .find({
          $or: [{ userId: id }, { collaborators: { $in: collaboratorIds } }],
        })
        .populate({
          path: 'collaborators',
          populate: { path: 'userId', model: 'User' },
        })
        .exec();

      return calendars;
    } catch (e) {
      throw new Error('Event not found');
    }
  }

  async addFeedback(payload: AddFeedbackDto) {
    try {
      // Create and save the feedback
      const feedback = new this.feedbackModel(payload);
      const savedFeedback = await feedback.save();

      // Update the corresponding event to include the feedback ID
      const event = await this.eventModel.findById(payload.eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Cast event.feedback to ObjectId[] to avoid type mismatch
      const feedbackArray: any = event.feedback;

      // Add the feedback ID to the event's feedback array
      feedbackArray.push(savedFeedback._id);

      // Save the updated event
      await event.save();

      return savedFeedback;
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw new Error('Failed to add feedback');
    }
  }

  generateImage = async (
    body: {
      audience: string;
      theme: string;
      contentType: string;
      aiPrompt: any;
      cloudinaryUrl: any;
    },
    eventId,
  ) => {
    try {
      let prompt = '';
      if (body.cloudinaryUrl == null) {
        if (body.aiPrompt != null) {
          prompt = body.aiPrompt;
        } else {
          prompt = imageGenerationPrompt(
            body.theme,
            body.audience,
            body.contentType,
          );
        }
        const response = await this.openai.images.generate({
          model: 'dall-e-3', // Specify the model (dall-e-3 or any available model)
          prompt: prompt, // The prompt describing the image
          n: 1, // Number of images to generate
          size: '1024x1024', // Image size
          response_format: 'url', // Return the
        });
        await this.eventModel.findByIdAndUpdate(eventId, {
          artwork: response.data[0].url,
        });
        return response.data[0].url;
      } else {
        await this.eventModel.findByIdAndUpdate(eventId, {
          artwork: body.cloudinaryUrl,
        });
        return body.cloudinaryUrl;
      }
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image');
    }
  };

  async addEvents(
    payload: CreateEventDto,
  ): Promise<{ message: string; event?: any }> {
    try {
      // Find the selected version
      const addEvent = new this.eventModel(payload);
      const newEvent: any = await addEvent.save();
      await this.calendarModel.findByIdAndUpdate(
        payload.calendarId,
        { $push: { events: newEvent._id } },
        { new: true },
      );
      return { message: 'Event created successfully', event: newEvent };
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  async editEvent(
    payload: CreateEventDto,
    eventId: string,
  ): Promise<{ message: string; event?: any }> {
    try {
      // Find the selected version
      const updatedEvent = await this.eventModel.findByIdAndUpdate(
        eventId,
        { $set: payload },
        { new: true }, // Return the updated document
      );
      if (!updatedEvent) {
        throw new Error('Event not found');
      }
      return {
        message: 'Event updated successfully',
        event: updatedEvent,
      };
    } catch (error) {
      console.error('Error edit event:', error);
      throw new Error('Failed to edit event');
    }
  }

  async deleteEvents(
    eventId: string,
    payload: { calendarId: string },
  ): Promise<{ message: string; event?: any }> {
    try {
      // Find the selected version
      const updatedEvent = await this.eventModel.findByIdAndDelete(eventId);
      if (!updatedEvent) {
        throw new Error('Event not found');
      }
      await this.calendarModel.findByIdAndUpdate(
        payload.calendarId,
        { $pull: { events: eventId } },
        { new: true },
      );
      return {
        message: 'Event deleted successfully',
        event: updatedEvent,
      };
    } catch (error) {
      console.error('Error delete event:', error);
      throw new Error('Failed to delete event');
    }
  }

  async updateEvent(payload: any): Promise<{ message: string; event?: any }> {
    const { eventId, updatedBy, changes, versionAction } = payload;

    try {
      // Find the event
      const event = await this.eventModel.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Increment the version number
      let newVersion = event.version;

      if (versionAction == 'new') {
        newVersion = event.version + 1;
      }

      // Create a new version entry in the VersionHistory collection
      const newVersionEntry: any = new this.versionModel({
        eventId: event._id,
        version: newVersion,
        changes: changes, // Store the changes made
        updatedBy: updatedBy, // User who made the changes
      });
      await newVersionEntry.save();

      // Add the new version ID to the event's versionHistory array
      event.versionHistory.push(newVersionEntry._id);

      // Ensure at most 5 versions are retained
      if (event.versionHistory.length > 5) {
        // Remove the oldest version ID from the array
        const oldestVersionId = event.versionHistory.shift();
        // Optionally, you can delete the oldest version document from the VersionHistory collection
        await this.versionModel.findByIdAndDelete(oldestVersionId);
      }

      // Update the event with the new changes
      event.set(changes); // Apply the changes to the event
      event.version = newVersion; // Update the version number
      await event.save();

      return { message: 'Event updated successfully', event };
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  async getEventSuggestion(eventId: string) {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new Error('Event not found');
    }
    const prompt = eventSuggestionPrompt(event);

    try {
      // Call the OpenAI API to generate tips
      const response: any = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Use GPT-4 for better quality responses
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 3000, // Increase token limit for more detailed responses
        temperature: 0.5, // Lower temperature for more focused and precise responses
      });

      // Extract the AI-generated tips from the response
      let data: any = jsonrepair(response?.choices[0]?.message?.content);
      data = JSON.parse(data);
      let tips = data.tips;
      return {
        success: true,
        tips,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getJobStatus(jobId: string, userId: string) {
    try {
      const job = await this.jobModel.findOne({
        jobId,
        userId: userId,
      });
      if (!job) throw new Error('Job not found');
      return {
        status: job.status,
        progress: job.progress,
        result: job.result,
        error: job.error,
      };
    } catch (e) {
      throw new Error('Failed to  find job');
    }
  }
}
