import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';
import * as env from 'dotenv';
env.config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

sequelize.addModels([path.join(__dirname, 'src/**/*.model.ts')]);

module.exports = sequelize;
