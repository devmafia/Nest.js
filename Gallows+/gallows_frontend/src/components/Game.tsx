// src/components/Game.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import HangmanDrawing from './HangmanDrawing';

type GameState = {
  maskedWord: string;
  remainingAttempts: number;
  wordId: string;
  guessedLetters: string[];
};


const Game = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [guess, setGuess] = useState<string>('');
  const [word, setWord] = useState<string | undefined>(undefined);

  const startNewGame = async () => {
    const response = await axios.get('http://localhost:3000/game/new');
    const data = response.data;
    setGameState(data.gameData);
    setWord(data.word);
  };


  const makeGuess = async () => {
    if (!gameState) return;

    try {
    const response = await axios.post(`http://localhost:3000/game/${gameState.wordId}/guess`, {
      letter: guess,
      guessedLetters: gameState.guessedLetters,
      remainingAttempts: gameState.remainingAttempts,
    });

    setGameState(response.data);
    if (response.data.remainingAttempts <= 0) {
      alert("You lost!")
    }
    if (response.data.maskedWord === word) {
      alert("You won!")
    }
    setGuess('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div>
      <h1>Gallows Game</h1>
      {gameState && (
        <div>
          <p>Word: {gameState.maskedWord}</p>
          <p>Remaining Attempts: {gameState.remainingAttempts}</p>

          <HangmanDrawing remainingAttempts={gameState.remainingAttempts} />

          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            maxLength={1}
          />
          <button onClick={makeGuess}>Guess</button>
        </div>
      )}
    </div>
  );
};

export default Game;
