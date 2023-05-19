import { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard';
import { initialBoard, getRandomWord, wordIsValid } from './utils/helper';
import "./App.css";

let guessedWord = getRandomWord();

function App() {
  const [boardState, setBoardState] = useState(initialBoard);
  const [currentGuess, setCurrentGuess] = useState("");
  const [notValidWord, setNotValidWord] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const currentRow = useRef(0);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardInput);

    return () => {
      document.removeEventListener("keydown", handleKeyboardInput);
    };
  }, []);

  useEffect(() => {
    if (isWin) return; 
    changeCurrentField(currentRow.current);

    if (currentGuess.length === 5) {
      if (currentGuess.toLowerCase() === guessedWord) {
        setIsWin(true);
      }

      if (wordIsValid(currentGuess)) {
        currentRow.current++;
        setCurrentGuess("");
      } else {
        setNotValidWord(true);
      }
    }
  }, [currentGuess]);

  function changeCurrentField(currRow) {
    setBoardState(currBoard => {
      return currBoard.map((row, rowId) => {
        if (rowId === currRow) {
          return row.map((field, fieldId) => {
            return currentGuess[fieldId];
          });
        }

        return row;
      });
    });
  }

  function handleKeyboardInput(event) {
    const letterPattern = /^[a-zA-Z]$/;
    const keyboardKey = event.key;

    if (currentRow.current === 6) return;

    if(letterPattern.test(keyboardKey)) {
      setCurrentGuess(prev => prev.length < 5 ? prev + keyboardKey.toUpperCase() : prev);
    } else if (keyboardKey === "Backspace") {
      setCurrentGuess(prev => prev.slice(0, prev.length - 1));
      setNotValidWord(false);
    }
  }

  function resetGame() {
    setBoardState(initialBoard);
    guessedWord = getRandomWord();
    setIsWin(false);
    currentRow.current = 0;
  }

  return (
    <div id="app-container">
      <h1>Wordle Game</h1>
      <GameBoard gameState={boardState} guessedWord={guessedWord} />
      {(currentRow.current >= 6 && !isWin) && `You lost, the word was ${guessedWord}`}
      {notValidWord && "That is not a valid word"}
      {isWin && `You won, you guessed it in ${currentRow.current} tries`}
      {(isWin || currentRow.current >= 6) && <button onClick={resetGame}>Reset game</button>}
    </div>
  );
}

export default App;
