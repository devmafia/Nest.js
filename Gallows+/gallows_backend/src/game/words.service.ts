import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Word, WordDocument } from '../schemas/word.schema';

@Injectable()
export class WordsService {
  constructor(
    @InjectModel(Word.name) public wordModel: Model<WordDocument>,
  ) {}

  async getRandomWord(): Promise<Word> {
    const count = await this.wordModel.countDocuments().exec();
    if (count === 0) return null;
    const randomIndex = Math.floor(Math.random() * count);
    const randomWord = await this.wordModel.findOne().skip(randomIndex).exec();
    return randomWord;
  }
}
