import WORDS from "./words";

export const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];
export const initialBoard = Array(6).fill(Array(5).fill(null));
export const wordIsValid = (word) => WORDS.includes(word.toLowerCase());