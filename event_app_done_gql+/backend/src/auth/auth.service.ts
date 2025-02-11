import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { UsersEvents } from '../models/models';
import { RegisterInput, LoginInput, AuthResponse } from '../dtos/auth.dto';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../types/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsersEvents)
    private readonly userModel: typeof UsersEvents,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { username, email, password } = input;
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ username, email, password: hashedPassword, role: UserRole.user });

    const token = this.generateToken(user.id, user.email, user.role);

    return { message: "User registered successfully", token, userId: user.id };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, user.role);
    console.log(user.role);
    return { message: "Login successful", token, userId: user.id };
  }

  private generateToken(userId: number, email: string, role: UserRole): string {
    const secretKey = role === UserRole.admin
      ? this.configService.get<string>('ADMIN_SECRET_KEY')
      : this.configService.get<string>('JWT_SECRET');

    const expiry = role === UserRole.admin
      ? this.configService.get<string>('ADMIN_EXPIRY')
      : this.configService.get<string>('JWT_EXPIRY');

    return this.jwtService.sign(
      { id: userId, email, role },
      {
        secret: secretKey,
        expiresIn: expiry,
      }
    );
  }

  logout(): AuthResponse {
    return { message: 'Logged out successfully', token: '', userId: null };
  }
}
