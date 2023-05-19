import { wordIsValid } from "../utils/helper";
import "./GameBoard.css";

export default function GameBoard({ gameState, guessedWord }) {
  return (
      <div id="gameboard-container">
          {gameState.map((row, rowId) => {
              return (<div className="row" key={rowId}>
              {row.map((field, fieldId) => {
                  const isValid = wordIsValid(row.join(""));
                  const isFinished = row.every(curr => curr != null) && isValid;
                  const guessedLetter = guessedWord[fieldId].toUpperCase();
                  const isSame = (guessedLetter === field) && isFinished;
                  const isIncluded = guessedWord.includes(field?.toLowerCase()) && isFinished;
                  const classes = `field ${isSame ? "right" : isIncluded ? "almost-right" : ""}`;
                  return <div className={classes} key={fieldId}>{field}</div>
              })}
              </div>);
          })}
      </div>
  );
}