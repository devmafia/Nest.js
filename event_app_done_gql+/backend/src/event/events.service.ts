import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Events, Seats } from '../models/models';
import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { Event } from '../dtos/models.dtos';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events) private readonly eventModel: typeof Events,
    @InjectModel(Seats) private readonly seatModel: typeof Seats,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventModel.findAll({ include: [Seats] });
  }

  async getEventById(id: number): Promise<Events> {
    const event = await this.eventModel.findByPk(id, { include: [Seats] });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async createEvent(createEventDto: CreateEventDto, imagePath: string): Promise<Event> {
    const image = imagePath.replace(/\\/g, '/');
    const eventData = { ...createEventDto, image };
    const event = await this.eventModel.create({
      ...eventData,
    });

    if (createEventDto.availableSeats <= 0) {
      throw new Error('Number of available seats must be greater than 0');
    }

    const seats = Array.from({ length: createEventDto.availableSeats }, (_, i) => ({
      eventId: event.id,
      seatNumber: `${i + 1}`,
      isBooked: false,
    }));
    await this.seatModel.bulkCreate(seats);

    return event;
  }

  async updateEvent(
    id: number,
    updateEventDto: Partial<UpdateEventDto>,
    imagePath?: string,
  ): Promise<Event> {
    const event = await this.getEventById(id);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (imagePath) {
      event.image = imagePath.replace(/\\/g, '/');
    }

    const { date, availableSeats, ...otherData } = updateEventDto;

    if (availableSeats && availableSeats !== event.availableSeats) {
      const newSeats = availableSeats - event.availableSeats;

      if (newSeats > 0) {
        const additionalSeats = Array.from({ length: newSeats }, (_, i) => ({
          eventId: event.id,
          seatNumber: `${event.availableSeats + i + 1}`,
          isBooked: false,
        }));
        await this.seatModel.bulkCreate(additionalSeats);
      } else {
        const seatsToRemove = await this.seatModel.findAll({
          where: { eventId: event.id },
          order: [['seatNumber', 'DESC']],
          limit: Math.abs(newSeats),
        });
        for (const seat of seatsToRemove) {
          await seat.destroy();
        }
      }
    }

    const updatedEventData = {
      ...otherData,
      date: date || event.date,
      image: event.image,
      availableSeats: availableSeats || event.availableSeats,
    };

    await event.update(updatedEventData);

    return event;
  }

  async deleteEvent(id: number) {
    const event = await this.getEventById(id);
    await event.destroy();
    return true;
  }
}
