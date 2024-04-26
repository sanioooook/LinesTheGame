import {Field} from '../types/field.type';
import {GameBoard} from '../types/gameBoard.type';

type Point = {i: number; j: number};

export function isPathBetween(
  start: Field,
  end: Field,
  board: GameBoard
): boolean {
  const visited: boolean[][] = Array.from({length: 9}, () =>
    Array(9).fill(false)
  );
  const queue: Point[] = [{i: start.i, j: start.j}];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]; // Up, Down, Left, Right

  while (queue.length > 0) {
    const {i, j} = queue.shift() as Point;

    if (i === end.i && j === end.j) {
      return true;
    }

    for (const [di, dj] of directions) {
      const ni = i + di,
        nj = j + dj;

      if (
        ni >= 0 &&
        ni < 9 &&
        nj >= 0 &&
        nj < 9 &&
        !visited[ni][nj] &&
        board[ni][nj].ball === null
      ) {
        visited[ni][nj] = true;
        queue.push({i: ni, j: nj});
      }
    }
  }

  return false;
}
export function checkLinesHelper(board: GameBoard): GameBoard {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ]; // Up, Down, Left, Right, Diagonals
  let newBoard = [...board];

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (newBoard[i][j].ball !== null) {
        const color = newBoard[i][j].ball?.color;

        for (const [di, dj] of directions) {
          let line = [{i, j}];

          for (let step = 1; step < 9; step++) {
            // Increase the step limit to 9
            const ni = i + step * di,
              nj = j + step * dj;

            if (
              ni >= 0 &&
              ni < 9 &&
              nj >= 0 &&
              nj < 9 &&
              newBoard[ni][nj].ball?.color === color
            ) {
              line.push({i: ni, j: nj});
            } else {
              break;
            }
          }

          if (line.length >= 5) {
            for (const {i, j} of line) {
              newBoard[i][j].ball = null;
            }
          }
        }
      }
    }
  }

  return newBoard;
}
