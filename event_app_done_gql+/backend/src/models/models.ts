import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import { UserRole } from '../types/types';

@Table({ timestamps: true })
export class Events extends Model<Events> {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  category: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  price: string;

  @Column({ type: DataType.STRING, allowNull: false })
  place: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  availableSeats: number;

  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @BelongsToMany(() => Bookings, () => BookingEvents)
  bookings: Bookings[];

  @HasMany(() => Seats, { onDelete: 'CASCADE' })
  seats: Seats[];
}

@Table({ timestamps: true })
export class UsersEvents extends Model<UsersEvents> {
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'user' })
  role: UserRole;

  @HasMany(() => Bookings, { onDelete: 'CASCADE' })
  bookings: Bookings[];
}

@Table({ timestamps: true })
export class Administrator extends Model<Administrator> {
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
}

@Table({ timestamps: true })
export class Bookings extends Model<Bookings> {
  @ForeignKey(() => UsersEvents)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  guestName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  guestEmail: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalPrice: number;

  @BelongsTo(() => UsersEvents, { onDelete: 'CASCADE' })
  user: UsersEvents;

  @BelongsToMany(() => Events, () => BookingEvents)
  events: Events[];

  @HasMany(() => Seats, { onDelete: 'CASCADE' })
  seats: Seats[];
}

@Table({ timestamps: true })
export class Seats extends Model<Seats> {
  @ForeignKey(() => Bookings)
  @Column({ type: DataType.INTEGER, allowNull: true })
  bookingId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  seatNumber: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isBooked: boolean;

  @BelongsTo(() => Bookings, { onDelete: 'CASCADE' })
  booking: Bookings;

  @ForeignKey(() => Events)
  @Column({ type: DataType.INTEGER, allowNull: false })
  eventId: number;

  @BelongsTo(() => Events, { onDelete: 'CASCADE' })
  event: Events;
}

@Table({ timestamps: false })
export class BookingEvents extends Model<BookingEvents> {
  @ForeignKey(() => Bookings)
  @Column({ type: DataType.INTEGER })
  bookingId: number;

  @ForeignKey(() => Events)
  @Column({ type: DataType.INTEGER })
  eventId: number;

  @BelongsTo(() => Bookings)
  booking: Bookings;

  @BelongsTo(() => Events)
  event: Events;
}

export const Models = {
  Events,
  UsersEvents,
  Administrator,
  Seats,
  Bookings,
  BookingEvents,
};
