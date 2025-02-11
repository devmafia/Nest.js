import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Events, Seats } from '../models/models';
import { ConfigModule } from '@nestjs/config';
import { FileUploadMiddleware } from './file-upload.middleware';
import { EventsController } from './events.controller';

@Module({
  imports: [
    ConfigModule, SequelizeModule.forFeature([Events, Seats]),
  ],
  controllers: [EventsController],
  providers: [EventsResolver, EventsService]
})
export class EventsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FileUploadMiddleware).forRoutes(
      { path: 'admin', method: RequestMethod.POST },
      { path: 'admin/:id', method: RequestMethod.PUT }
    );
  }
}
