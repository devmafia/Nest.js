import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bookings, UsersEvents  } from '../models/models';
import { UserResponse } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UsersEvents) private readonly userModel: typeof UsersEvents,
    @InjectModel(Bookings) private readonly bookingsModel: typeof Bookings,
  ) {}

  async getUserById(userId: number): Promise<UserResponse> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user };
  }

  async updateUsername(userId: number, username: string): Promise<UserResponse> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.username = username;
    await user.save();
    return { user };
  }

  async updateEmail(userId: number, email: string): Promise<UserResponse> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.email = email;
    await user.save();
    return { user };
  }

  async updatePassword(userId: number, password: string): Promise<boolean> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    await user.save();
    return true;
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      await this.bookingsModel.destroy({ where: { userId } });
      const deletedUser = await this.userModel.destroy({ where: { id: userId } });
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      const success = true;
      return success;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
      console.error(error);
    }
  }
}
