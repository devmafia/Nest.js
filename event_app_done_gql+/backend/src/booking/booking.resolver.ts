import { UserRole } from './../types/types';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookingsService } from './booking.service';
import { CreateBookingDto, BookingDto, DeleteBookingDto } from '../dtos/booking.dto';
import { Role, RoleAuthGuard } from 'src/auth/roles.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Query(() => [BookingDto])
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.user, UserRole.admin)
  async getBookings(@Args('userId', { nullable: true }) userId: number) {
    return this.bookingsService.getBookings(userId);
  }

  @Mutation(() => BookingDto)
  async createBooking(@Args('input') createBookingInput: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingInput);
  }

  @Mutation(() => Boolean)
  @Role(UserRole.user, UserRole.admin)
  async deleteBooking(@Args('variables') variables: DeleteBookingDto) {
    const { bookingId } = variables;
    await this.bookingsService.deleteBooking(bookingId);
    return true;
  }
}
