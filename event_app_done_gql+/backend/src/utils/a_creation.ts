import * as bcrypt from 'bcrypt';
import { Administrator, BookingEvents, Bookings, Events, Seats, UsersEvents } from '../models/models';
import { UserRole } from '../types/types';
import * as env from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

env.config({ path: '../../.env' });

console.log('Database dialect:', process.env.DB_DIALECT);

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT as Dialect,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  models: [UsersEvents, Administrator, Bookings, Events, BookingEvents, Seats],
});

async function createAdmin(username: string, email: string, password: string) {
  await sequelize.sync();

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await UsersEvents.create({
    username,
    email,
    password: hashedPassword,
    role: UserRole.admin,
  });

  console.log('Admin created:', admin);
}

createAdmin('admin', 'admin@example.com', 'admin')
  .then(() => console.log('Admin user created successfully'))
  .catch((err) => console.error('Error creating admin:', err));
