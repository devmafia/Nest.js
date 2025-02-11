import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field(() => ID)
  id?: number;

  @Field()
  title: string;

  @Field()
  date: Date;

  @Field()
  category: string;

  @Field()
  description: string;

  @Field()
  price: string;

  @Field()
  place: string;

  @Field(() => Int)
  availableSeats: number;

  @Field()
  image: string;

  @Field(() => [Seat], { nullable: true })
  seats?: Seat[];
}

@ObjectType()
export class UserEvent {
  @Field(() => ID, { nullable: true})
  id?: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  role: string;
}

@ObjectType()
export class Administrator {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class Seat {
  @Field(() => ID)
  id?: number;

  @Field()
  seatNumber: string;

  @Field(() => Boolean)
  isBooked: boolean;

  @Field(() => Event)
  event: Event;

  @Field()
  eventId: number;
}

@ObjectType()
export class Booking {
  @Field(() => ID)
  id?: number;

  @Field()
  guestName: string;

  @Field()
  guestEmail: string;

  @Field()
  phone: string;

  @Field(() => Int)
  totalPrice: number;

  @Field(() => UserEvent, { nullable: true })
  user?: UserEvent;

  @Field(() => [Event], { nullable: true })
  events?: Event[];

  @Field(() => [Seat], { nullable: true })
  seats?: Seat[];
}

@ObjectType()
export class BookingEvent {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  bookingId: number;

  @Field(() => Int)
  eventId: number;

  @Field(() => Booking)
  booking: Booking;

  @Field(() => Event)
  event: Event;
}

@ObjectType()
export class BookingSeat {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  bookingId: number;

  @Field(() => Int)
  seatId: number;

  @Field(() => Int)
  eventId: number;

  @Field(() => Booking)
  booking: Booking;

  @Field(() => Seat)
  seat: Seat;

  @Field(() => Event)
  event: Event;
}
