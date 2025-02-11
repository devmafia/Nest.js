import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersEvents, Bookings } from '../models/models';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([UsersEvents, Bookings]),
  ],
  providers: [UserService, UserResolver],
})
export class UserModule {}
