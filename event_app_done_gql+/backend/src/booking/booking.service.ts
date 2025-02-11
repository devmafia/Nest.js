import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBookingDto } from '../dtos/booking.dto';
import { UsersEvents, Bookings, Events, Seats, BookingEvents } from '../models/models';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(UsersEvents) private usersEventsModel: typeof UsersEvents,
    @InjectModel(Bookings) private bookingsModel: typeof Bookings,
    @InjectModel(Events) private eventsModel: typeof Events,
    @InjectModel(Seats) private seatsModel: typeof Seats,
    @InjectModel(BookingEvents) private bookingEventsModel: typeof BookingEvents,
  ) {}

  async getBookings(userId?: number): Promise<Bookings[]> {
    const where: any = {};
    if (userId) where.userId = userId;

    const bookings = await this.bookingsModel.findAll({
      where,
      include: [
        {
          model: this.eventsModel,
          as: 'events',
          required: true,
          attributes: ['id', 'title', 'description', 'price', 'image', 'date'],
        },
        {
          model: this.seatsModel,
          as: 'seats',
          required: false,
        },
      ],
    });

    return bookings;
  }

  async createBooking(dto: CreateBookingDto): Promise<Bookings> {
    const { userId, guestName, guestEmail, phone, events } = dto;

    const userExists = await this.usersEventsModel.findByPk(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    const transaction = await this.bookingsModel.sequelize.transaction();
    try {
      const booking = await this.bookingsModel.create(
        { userId, guestName, guestEmail, phone, totalPrice: 0 },
        { transaction },
      );

      let totalPrice = 0;

      for (const event of events) {
        const { eventId, seats } = event;

        const eventRecord = await this.eventsModel.findByPk(eventId, { transaction });
        if (!eventRecord || eventRecord.availableSeats < seats.length) {
          throw new Error(`Insufficient seats available for event ${eventId}`);
        }

        await this.bookingEventsModel.create(
          { bookingId: booking.id, eventId },
          { transaction },
        );

        for (const seatId of seats) {
          const seat = await this.seatsModel.findByPk(seatId, { transaction });
          if (!seat || seat.isBooked) {
            throw new Error(`Seat ${seatId} is already booked.`);
          }

          seat.isBooked = true;
          seat.bookingId = booking.id;
          await seat.save({ transaction });
        }

        eventRecord.availableSeats -= seats.length;
        await eventRecord.save({ transaction });

        totalPrice += parseFloat(eventRecord.price) * seats.length;
      }

      booking.totalPrice = totalPrice;
      await booking.save({ transaction });

      await transaction.commit();
      return booking;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteBooking(bookingId: number): Promise<boolean> {
    const transaction = await this.bookingsModel.sequelize.transaction();

    try {
      const booking = await this.bookingsModel.findByPk(bookingId, {
        include: [
          { model: this.seatsModel, as: 'seats' },
          { model: this.eventsModel, as: 'events' },
        ],
        transaction,
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      for (const seat of booking.seats) {
        seat.isBooked = false;
        seat.bookingId = null;
        await seat.save({ transaction });
      }

      for (const event of booking.events) {
        const affectedSeatsCount = booking.seats.filter((seat) => seat.eventId === event.id).length;
        event.availableSeats += affectedSeatsCount;
        await event.save({ transaction });
      }

      await this.bookingEventsModel.destroy({ where: { bookingId }, transaction });
      await this.bookingsModel.destroy({ where: { id: bookingId }, transaction });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
