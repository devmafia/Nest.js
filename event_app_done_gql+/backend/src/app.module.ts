import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule } from '@nestjs/sequelize';
import { Models } from './models/models';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as env from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from "./user/user.module"
import { EventsModule } from './event/events.module';
import { BookingModule } from './booking/booking.module';
import { Dialect } from 'sequelize';

env.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature(Object.values(Models)),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
      debug: true,
      autoSchemaFile: './schema.gql',
    }),
    AuthModule, UserModule, EventsModule, BookingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
