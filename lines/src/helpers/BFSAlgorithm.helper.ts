import {Field} from '../types/field.type';
import {GameBoard} from '../types/gameBoard.type';

type Point = {i: number; j: number};

export function isPathBetween(start: Field, end: Field, board: GameBoard): boolean {
  const visited: boolean[][] = Array.from({length: 9}, () => Array(9).fill(false));
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

      if (ni >= 0 && ni < 9 && nj >= 0 && nj < 9 && !visited[ni][nj] && board[ni][nj].ball === null) {
        visited[ni][nj] = true;
        queue.push({i: ni, j: nj});
      }
    }
  }

  return false;
}

export function findPath(start: Field, end: Field, board: GameBoard): Field[] | null {
  const visited: boolean[][] = Array.from({length: 9}, () => Array(9).fill(false));
  const prev: ({i: number; j: number} | null)[][] = Array.from({length: 9}, () => Array(9).fill(null));
  const queue: {i: number; j: number}[] = [{i: start.i, j: start.j}];
  visited[start.i][start.j] = true;
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (queue.length > 0) {
    const {i, j} = queue.shift()!;

    if (i === end.i && j === end.j) {
      const path: Field[] = [];
      let cur: {i: number; j: number} | null = {i, j};
      while (cur && (cur.i !== start.i || cur.j !== start.j)) {
        path.unshift(board[cur.i][cur.j]);
        cur = prev[cur.i][cur.j];
      }
      return path;
    }

    for (const [di, dj] of directions) {
      const ni = i + di,
        nj = j + dj;
      if (ni >= 0 && ni < 9 && nj >= 0 && nj < 9 && !visited[ni][nj] && board[ni][nj].ball === null) {
        visited[ni][nj] = true;
        prev[ni][nj] = {i, j};
        queue.push({i: ni, j: nj});
      }
    }
  }

  return null;
}

export type LineCheckResult = {
  newBoard: GameBoard;
  linesFound: boolean;
  scoreIncrement: number;
};

export function findAndRemoveLines(board: GameBoard): LineCheckResult {
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
  const newBoard: GameBoard = board.map((row) => row.map((cell) => ({...cell})));
  let linesFound = false;
  let scoreIncrement = 0;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (newBoard[i][j].ball !== null) {
        const color = newBoard[i][j].ball?.color;

        for (const [di, dj] of directions) {
          const line = [{i, j}];
          let step = 1;

          while (true) {
            const ni = i + step * di,
              nj = j + step * dj;

            if (ni >= 0 && ni < 9 && nj >= 0 && nj < 9 && newBoard[ni][nj].ball?.color === color) {
              line.push({i: ni, j: nj});
            } else {
              break;
            }
            step++;
          }

          if (line.length >= 5) {
            for (const {i, j} of line) {
              newBoard[i][j].ball = null;
            }
            scoreIncrement += line.length;
            linesFound = true;
          }
        }
      }
    }
  }

  return {newBoard, linesFound, scoreIncrement};
}
