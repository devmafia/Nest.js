import { IsEmail, IsNotEmpty, IsArray, IsString, IsNumber } from 'class-validator';
import { Field, ObjectType, InputType, Int } from '@nestjs/graphql';
import { Event, Seat } from './models.dtos';

@InputType()
export class CreateBookingDto {

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  guestName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  guestEmail: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @Field(() => [EventBookingInput])
  @IsArray()
  events: {
    eventId: number;
    seats: number[];
  }[];
}

@InputType()
export class EventBookingInput {

  @Field(() => Int)
  eventId: number;

  @Field(() => [Int])
  seats: number[];

  @Field(() => Int)
  quantity: number;
}


@ObjectType()
export class BookingDto {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  guestName: string;

  @Field()
  guestEmail: string;

  @Field()
  phone: string;

  @Field()
  totalPrice: number;

  @Field(() => [Event])
  events: Event[];

  @Field(() => [Seat])
  seats: Seat[];
}

@InputType()
export abstract class DeleteBookingDto {

  @Field()
  bookingId: number;
}


