import {createSlice, Slice} from '@reduxjs/toolkit';
import {GameBoard} from '../../types/gameBoard.type';
import {
  applyBestScore,
  applyLatestScore,
  changeBoard,
  changeLanguage,
  changeSelectedBall,
  incrementScore,
  moveBall,
  moveBallStep,
  placeBallsAndGenerateNextBalls,
  restartGame,
  setIsAnimating,
  setShakingField,
  startGame,
} from '../actions/gameBoard.actions';
import {Field} from '../../types/field.type';
import {Ball} from '../../types/ball.type';
import {generateNewBalls, placeNewBallsOnBoards} from '../../helpers/generate.helper';
import {LanguagesEnum} from '../../types/languages.enum';

export type InitialState = {
  board: GameBoard;
  currentSelectedField: Field | null;
  score: {
    currentScore: number;
    bestScore: number;
    latestScore: number;
  };
  boardWithNextBalls: Ball[] | undefined[];
  selectedLanguage: LanguagesEnum;
  animation: {
    isAnimating: boolean;
    shakingField: {i: number; j: number} | null;
  };
};

export const initialState: InitialState = {
  board: Array.from({length: 9}, (_, i) => Array.from({length: 9}, (_, j) => ({ball: null, i, j}))),
  currentSelectedField: null,
  score: {
    bestScore: 0,
    currentScore: 0,
    latestScore: 0,
  },
  boardWithNextBalls: Array.from({length: 3}, () => {
    return undefined;
  }),
  selectedLanguage: LanguagesEnum.en,
  animation: {
    isAnimating: false,
    shakingField: null,
  },
};

function initializeBoardWithBalls(state: InitialState): void {
  state.board = Array.from({length: 9}, (_, i) => Array.from({length: 9}, (_, j) => ({ball: null, i, j})));
  state.boardWithNextBalls = generateNewBalls(3);
  const fields = placeNewBallsOnBoards(state.board, generateNewBalls(3));
  for (let i = 0; i < fields.length; i++) {
    state.board[fields[i].i][fields[i].j].ball = fields[i].ball;
  }
}

export const gameBoardSlice: Slice<InitialState, NonNullable<unknown>, 'gameBoard'> = createSlice({
  name: 'gameBoard',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changeSelectedBall, (state, {payload}) => {
        if (state.currentSelectedField && state.currentSelectedField.ball) {
          state.board[state.currentSelectedField.i][state.currentSelectedField.j].ball = {
            ...state.currentSelectedField.ball,
            isSelected: false,
          };
        }
        if (state.currentSelectedField && state.currentSelectedField.j === payload.j && state.currentSelectedField.i === payload.i) {
          state.currentSelectedField = null;
          return;
        }
        if (payload.ball) {
          state.currentSelectedField = payload;
          state.board[payload.i][payload.j].ball = {
            ...payload.ball,
            isSelected: true,
          };
        }
      })
      .addCase(moveBall, (state, {payload}) => {
        if (state.currentSelectedField && state.currentSelectedField.ball) {
          const startField = state.currentSelectedField;
          const endField = payload;

          // Move the ball
          state.board[endField.i][endField.j].ball = {
            ...state.board[startField.i][startField.j].ball,
            isSelected: false,
          } as Ball;
          state.board[startField.i][startField.j].ball = null;
          state.currentSelectedField = null;
        }
      })
      .addCase(placeBallsAndGenerateNextBalls, (state) => {
        const fields = placeNewBallsOnBoards(state.board, state.boardWithNextBalls as Ball[]);
        for (let i = 0; i < fields.length; i++) {
          state.board[fields[i].i][fields[i].j].ball = fields[i].ball;
        }
        state.boardWithNextBalls = generateNewBalls(3);
      })
      .addCase(startGame, (state) => {
        initializeBoardWithBalls(state);
      })
      .addCase(restartGame, (state) => {
        state.score.latestScore = state.score.currentScore;
        if (state.score.currentScore > state.score.bestScore) {
          state.score.bestScore = state.score.currentScore;
        }
        state.score.currentScore = 0;
        initializeBoardWithBalls(state);
      })
      .addCase(changeBoard, (state, action) => {
        state.board = action.payload;
      })
      .addCase(incrementScore, (state, action) => {
        state.score.currentScore += action.payload;
      })
      .addCase(changeLanguage, (state, action) => {
        state.selectedLanguage = action.payload;
      })
      .addCase(applyBestScore, (state, action) => {
        state.score.bestScore = action.payload;
      })
      .addCase(applyLatestScore, (state, action) => {
        state.score.latestScore = action.payload;
      })
      .addCase(moveBallStep, (state, {payload}) => {
        const {fromI, fromJ, toI, toJ} = payload;
        const ball = state.board[fromI][fromJ].ball;
        state.board[toI][toJ].ball = ball ? {...ball, isSelected: false} : null;
        state.board[fromI][fromJ].ball = null;
        state.currentSelectedField = null;
      })
      .addCase(setIsAnimating, (state, {payload}) => {
        if (!state.animation) state.animation = {isAnimating: false, shakingField: null};
        state.animation.isAnimating = payload;
      })
      .addCase(setShakingField, (state, {payload}) => {
        if (!state.animation) state.animation = {isAnimating: false, shakingField: null};
        state.animation.shakingField = payload;
      });
  },
});

export default gameBoardSlice.reducer;
