import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Word, WordSchema } from '../schemas/word.schema';
import { WordsService } from './words.service';
import { GameController } from './game.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }])],
  providers: [WordsService],
  controllers: [GameController],
})
export class GameModule {}
