
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingsService } from './booking.service';
import { BookingsResolver } from './booking.resolver';
import {Bookings, Events, Seats, UsersEvents, BookingEvents } from '../models/models';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([UsersEvents, Bookings, Events, Seats, BookingEvents]),
  ],
  providers: [BookingsService, BookingsResolver],
})
export class BookingModule {}
