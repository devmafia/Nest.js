import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UsersEvents, Administrator } from '../models/models';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleAuthGuard } from './roles.guard';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([UsersEvents, Administrator]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, RoleAuthGuard,
    {
      provide: 'ADMIN_JWT_OPTIONS',
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ADMIN_SECRET_KEY'),
        expiresIn: configService.get<string>('ADMIN_EXPIRY'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [ JwtModule ],
})
export class AuthModule {}
