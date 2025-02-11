import { Body, Controller, Delete, Param, Put, Post, BadRequestException, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from "../dtos/event.dto"
import { Role, RoleAuthGuard } from '../auth/roles.guard';
import { UserRole } from '../types/types';

@Controller('admin')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.admin)
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const { image, ...eventData } = createEventDto;

    return this.eventsService.createEvent(eventData, image);
  }

  @Put(':id')
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.admin)
  async updateEvent(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const { date, image, ...otherData } = updateEventDto;

    const eventDate = date ? new Date(date) : null;

    if (eventDate && isNaN(eventDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.eventsService.updateEvent(id, { ...otherData, date: eventDate }, image);
  }

  @Delete(':id')
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.admin)
  async deleteEvent(@Param('id') id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
