import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { WordsService } from './words.service';

@Controller('game')
export class GameController {
  constructor(private readonly wordsService: WordsService) {}

  @Get('new')
  async startNewGame() {
    const word = await this.wordsService.getRandomWord();
    if (!word) {
      throw new NotFoundException('No words found in the database');
    }
    const maskedWord = '_'.repeat(word.text.length);
    return { gameData: { maskedWord, remainingAttempts: 6, wordId: word._id, guessedLetters: [] }, word: word.text};
  }

  @Post(':id/guess')
  async makeGuess(
    @Param('id') wordId: string,
    @Body('letter') letter: string,
    @Body('guessedLetters') guessedLetters: string[],
    @Body('remainingAttempts') remainingAttempts: number,
  ) {
    const word = await this.wordsService.wordModel.findById(wordId).exec();
    const wordText = word.text;
    let newRemainingAttempts = remainingAttempts;
    if (!wordText.includes(letter)) {
      newRemainingAttempts -= 1;
    }

    guessedLetters.push(letter);

    const updatedMaskedWord = wordText
      .split('')
      .map((char) => (guessedLetters.includes(char) ? char : '_'))
      .join('');

    return { maskedWord: updatedMaskedWord, wordId: word._id, remainingAttempts: newRemainingAttempts, guessedLetters };
  }
}
