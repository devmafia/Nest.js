import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from "path";
// import { Sequelize } from 'sequelize-typescript';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // const sequelize = app.get(Sequelize);
  // await sequelize.sync({ alter: true });

  app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
