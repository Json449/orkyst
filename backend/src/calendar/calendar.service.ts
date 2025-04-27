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
  defaultPrompt,
  eventSuggestionPrompt,
  generateCalendarPrompt,
  generateDynamicBlogPostPrompt,
  imageGenerationPrompt,
  linkedInPrompt,
  twitterPrompt,
} from 'src/utils';
import { CollaboratorDocument } from './schemas/collaborator.schema';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UserDocument } from 'src/users/schemas/user.schema';

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
    const calendar = await this.calendarModel.findById(id).exec();
    if (!calendar) {
      throw new Error('No record found');
    }
    if (calendar?.suggestions != null) {
      return JSON.parse(calendar.suggestions);
    }
    // Generate the prompt for AI tips based on the calendar data
    const prompt = calendarSuggestionPrompt(calendar.calendarInputs);

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
      console.log(data);
      let tips = data.tips;
      console.log(tips);
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

  async generateCalendar(calendarInputs, userId: string): Promise<any> {
    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    console.log('Input received:', calendarInputs);

    // Construct the prompt for OpenAI API
    const prompt = generateCalendarPrompt(
      calendarInputs,
      currentMonth,
      currentYear,
    );

    try {
      // OpenAI API call
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
      // Parse the OpenAI response into a JavaScript object
      const fixedJson = jsonrepair(response?.choices[0]?.message?.content);
      let calendarData: any;
      try {
        calendarData = JSON.parse(fixedJson);
      } catch (parseError) {
        throw new Error('Failed to parse OpenAI response');
      }
      console.log('view snoww', calendarData);
      // Validate the received calendar data
      if (
        !calendarData.month ||
        !calendarData.theme ||
        !Array.isArray(calendarData.events)
      ) {
        throw new Error('Invalid calendar data received from OpenAI');
      }

      // Validate and adjust dates to ensure they are within the current month
      const validatedEvents = calendarData.events.map((event: any) => {
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

      // Update the events with validated dates
      calendarData.events = validatedEvents;
      calendarData.calendarInputs = calendarInputs;
      // Add the userId to the calendar data
      calendarData.userId = userId;
      calendarData.suggestions = null;
      calendarData.isActive = true;

      // Create and save the calendar, link it to events
      const newCalendar = new this.calendarModel(calendarData);

      // Create and save events (assuming events are already validated)
      const eventPromises = calendarData.events.map(async (eventData: any) => {
        const newEvent = new this.eventModel({
          title: eventData.title,
          date: new Date(eventData.date),
          type: eventData.type,
          audienceFocus: eventData.audienceFocus,
          theme: eventData.theme,
          description: null,
          calendarId: newCalendar._id, // Assign the calendarId
        });
        const savedEvent = await newEvent.save();
        return savedEvent._id;
      });

      // Wait for all events to be saved and get their IDs
      const eventIds = await Promise.all(eventPromises);

      // Link events to the calendar
      newCalendar.events = eventIds;
      await this.calendarModel.updateMany(
        { userId: userId },
        { isActive: false },
      );
      // Save the new calendar with linked events
      return await newCalendar.save();
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

      console.log('Saved Feedback:', savedFeedback);

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

  async revertEventVersion(
    payload: any,
  ): Promise<{ message: string; event?: any }> {
    const { eventId, version } = payload;
    try {
      // Find the selected version
      const selectedVersion = await this.versionModel.findOne({
        eventId,
        version: Number(version),
      });
      if (!selectedVersion) {
        throw new Error('Version not found');
      }

      // Find the event
      const event = await this.eventModel.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Revert the event to the selected version
      event.set(selectedVersion.changes); // Apply the changes from the selected version
      await event.save();

      return { message: 'Event reverted successfully', event };
    } catch (error) {
      console.error('Error reverting event:', error);
      throw new Error('Failed to revert event');
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
        max_tokens: 1000, // Increase token limit for more detailed responses
        temperature: 1, // Lower temperature for more focused and precise responses
      });

      // Extract the AI-generated tips from the response
      let data: any = jsonrepair(response?.choices[0]?.message?.content);
      data = JSON.parse(data);
      console.log(data);
      let tips = data.tips;
      console.log(tips);
      return {
        success: true,
        tips,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
