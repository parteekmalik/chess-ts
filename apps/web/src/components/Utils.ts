import type { Color, Square } from "chess.js";
import { SQUARES } from "chess.js";

// arrayUtils.ts
export function getLastElement<T>(arr: T[]): T {
  return arr[arr.length - 1] as T;
}

export const buttonStyle = "m-3 bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer";
function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function convertMsToTime(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return milliseconds >= 20000
    ? `${padTo2Digits(hours) === "00" ? "" : padTo2Digits(hours) + ":"}${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
    : milliseconds >= 0
      ? `00:${padTo2Digits(seconds)}:${padTo2Digits(Math.floor((milliseconds % 1000) / 10))}`
      : "00:00:00";
}

export const checkForValidClick = (event: React.MouseEvent, flip: Color) => {
  const { clientX, clientY, currentTarget } = event;
  const { left, top, right, bottom } = currentTarget.getBoundingClientRect();

  // Check if the click is within the boundaries of the target element
  const isValid = clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;

  const squareSize: number = (bottom - top) / 8;

  const col = isValid ? Math.floor((clientX - left) / squareSize) : -1;
  const row = isValid ? Math.floor((clientY - top) / squareSize) : -1;

  if (flip != ("b" as Color)) return { isValid, square: SQUARES[row * 8 + col]! };
  else return { isValid, square: SQUARES[(7 - row) * 8 + col]! };
};

export const toRowCol = (square: Square): { row: number; col: number } => {
  const row = Math.floor(SQUARES.indexOf(square) / 8);
  const col = SQUARES.indexOf(square) % 8;
  return { row, col };
};
