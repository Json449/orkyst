import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { CreateEventDto } from './dto/create-event-dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}
  @Get('details/:id')
  @UseGuards(JwtAuthGuard)
  async getCalendarDetails(@Param('id') id) {
    return this.calendarService.getCalendarDetails(id);
  }

  @Post('collaborator/:calendarId')
  async addCollaborator(
    @Param('calendarId') calendarId: string,
    @Body() createCollaboratorDto: CreateCollaboratorDto,
  ) {
    try {
      const result = await this.calendarService.addCollaborator(
        calendarId,
        createCollaboratorDto,
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error in addCollaborator:', error);
      throw new HttpException(
        error.response?.message ||
          error.message ||
          'Failed to add collaborator',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getCalendarList(@Request() req) {
    return this.calendarService.getCalendarList(req.user.userId);
  }

  @Get('events/details/:id')
  async generateBlogPostContent(@Param('id') id: string) {
    return this.calendarService.generateBlogPostContent(id);
  }

  // @Post('event/revert-version')
  // async revertVersion(@Body() payload: any) {
  //   try {
  //     // Call the service method to revert the event version
  //     const result = await this.calendarService.revertEventVersion(payload);

  //     // Return success response
  //     return {
  //       status: 'success',
  //       message: result.message,
  //       data: result.event,
  //     };
  //   } catch (error) {
  //     // Handle errors and return appropriate HTTP status code
  //     throw new HttpException(
  //       {
  //         status: 'error',
  //         message: error.message || 'Failed to revert event version',
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  @Post('events/add')
  async addEvents(@Body() payload: CreateEventDto) {
    try {
      console.log('wowwww', payload);
      // Call the service method to revert the event version
      const result = await this.calendarService.addEvents(payload);

      // Return success response
      return {
        status: 'success',
        message: result.message,
        data: result.event,
      };
    } catch (error) {
      // Handle errors and return appropriate HTTP status code
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to revert event version',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('events/:eventId')
  async editEvents(
    @Param('eventId') eventId: string,
    @Body() payload: CreateEventDto,
  ) {
    try {
      const result = await this.calendarService.editEvent(payload, eventId);
      return {
        status: 'success',
        message: result.message,
        data: result.event,
      };
    } catch (error) {
      // Handle errors and return appropriate HTTP status code
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to edit event',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('events/:eventId')
  async deleteEvents(
    @Param('eventId') eventId: string,
    @Body() payload: { calendarId: string },
  ) {
    try {
      const result = await this.calendarService.deleteEvents(eventId, payload);
      return {
        status: 'success',
        message: result.message,
        data: result.event,
      };
    } catch (error) {
      // Handle errors and return appropriate HTTP status code
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to delete event',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('suggestions/:id')
  async getCalendarSuggestions(@Param('id') id: string) {
    let data = await this.calendarService.getCalendarSuggestions(id);
    return {
      result: data,
      status: 200,
    };
  }

  @Post('feedback')
  @UseGuards(JwtAuthGuard)
  async addFeedback(@Request() req, @Body() data) {
    const response = await this.calendarService.addFeedback({
      userId: req.user.userId,
      ...data,
    });
    return {
      result: response,
      status: 200,
    };
  }

  @Put('image-generation/:id')
  @UseGuards(JwtAuthGuard)
  async generateImage(@Param('id') id: string, @Body() prompt) {
    const response = await this.calendarService.generateImage(prompt, id);
    return {
      result: response,
      status: 200,
    };
  }

  @Get('event/suggestion/:id')
  @UseGuards(JwtAuthGuard)
  async getEventSuggestion(@Param('id') id: string) {
    const response = await this.calendarService.getEventSuggestion(id);
    return {
      result: response,
      status: 200,
    };
  }

  @Put('event')
  @UseGuards(JwtAuthGuard)
  async updateEvent(@Request() req, @Body() payload: any) {
    try {
      // Call the service method to update the event
      const result = await this.calendarService.updateEvent({
        updatedBy: req.user.userId,
        ...payload,
      });

      // Return success response
      return {
        status: 'success',
        message: result.message,
        data: result.event,
      };
    } catch (error) {
      // Handle errors and return appropriate HTTP status code
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to update event',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('job-status/:jobId')
  @UseGuards(JwtAuthGuard)
  async getJobStatus(@Request() req, @Param('jobId') jobId: string) {
    try {
      const job = await this.calendarService.getJobStatus(
        jobId,
        req.user.userId,
      );
      return {
        status: job.status,
        progress: job.progress,
        result: job.result,
        error: job.error,
      };
    } catch (error) {
      // Handle errors and return appropriate HTTP status code
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to find job',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
