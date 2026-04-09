import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import {Field} from '../../types/field.type';
import {Ball} from '../../types/ball.type';
import {RootState} from '../store';
import {findPath, findAndRemoveLines} from '../../helpers/BFSAlgorithm.helper';
import {GameBoard} from '../../types/gameBoard.type';
import {LanguagesEnum} from '../../types/languages.enum';
import {updateScore, getScore} from '../../firebase/functions/function-helper';
import {generateNewBalls, placeNewBallsOnBoards} from '../../helpers/generate.helper';
import {seededRandom} from '../../helpers/seededRandom.helper';

const baseType = 'GAME_BOARD/';

const STEP_DELAY_MS = 80;
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const setIsAnimating = createAction<boolean>(`${baseType}SET_IS_ANIMATING`);
export const setShakingField = createAction<{i: number; j: number} | null>(`${baseType}SET_SHAKING_FIELD`);
export const moveBallStep = createAction<{fromI: number; fromJ: number; toI: number; toJ: number}>(`${baseType}MOVE_BALL_STEP`);

export const changeSelectedBall = createAction<Field>(`${baseType}CHANGE_SELECTED`);
export const changeBoard = createAction<GameBoard>(`${baseType}CHANGE_BOARD`);
export const moveBall = createAction<Field>(`${baseType}MOVE_BALL`);
export const startGame = createAction(`${baseType}START_GAME`);
export const restartGame = createAction(`${baseType}RESTART_GAME`);
export const applyBestScore = createAction<number>(`${baseType}APPLY_BEST_SCORE`);
export const applyLatestScore = createAction<number>(`${baseType}APPLY_LATEST_SCORE`);
export const placeBallsAndGenerateNextBalls = createAction<{placedFields: Field[]; nextBalls: Ball[]}>(`${baseType}PLACE_BALLS_AND_GENERATE_NEXT_BALLS`);
export const incrementScore = createAction<number>(`${baseType}INCREMENT_SCORE`);
export const changeLanguage = createAction<LanguagesEnum>(`${baseType}CHANGE_LANGUAGE`);

export const saveHistorySnapshot = createAction<{board: GameBoard; boardWithNextBalls: (Ball | undefined)[]; currentScore: number}>(`${baseType}SAVE_HISTORY_SNAPSHOT`);
export const incrementMoveNumber = createAction(`${baseType}INCREMENT_MOVE_NUMBER`);
export const undoMove = createAction(`${baseType}UNDO_MOVE`);

export const moveBallAndCheckLines = createAsyncThunk<void, Field, {state: RootState}>(
  `${baseType}MOVE_BALL_AND_CHECK_LINES`,
  async (endField, {dispatch, getState}) => {
    const {currentSelectedField} = getState().gameBoard;

    if (currentSelectedField && currentSelectedField.ball) {
      // Check if the end field is free
      if (endField.ball !== null) {
        return;
      }

      // Find path via BFS
      const path = findPath(currentSelectedField, endField, getState().gameBoard.board);

      if (!path) {
        // Blocked — shake animation
        dispatch(setShakingField({i: currentSelectedField.i, j: currentSelectedField.j}));
        await delay(400);
        dispatch(setShakingField(null));
        return;
      }

      // Save snapshot BEFORE the move (allows full undo back to this board state)
      const stateSnapshot = getState().gameBoard;
      dispatch(
        saveHistorySnapshot({
          board: stateSnapshot.board.map((row) => row.map((cell) => ({...cell, ball: cell.ball ? {...cell.ball} : null}))),
          boardWithNextBalls: [...stateSnapshot.boardWithNextBalls] as (Ball | undefined)[],
          currentScore: stateSnapshot.score.currentScore,
        }),
      );

      // Animate step by step along the path
      dispatch(setIsAnimating(true));
      let fromI = currentSelectedField.i;
      let fromJ = currentSelectedField.j;
      for (const step of path) {
        dispatch(moveBallStep({fromI, fromJ, toI: step.i, toJ: step.j}));
        fromI = step.i;
        fromJ = step.j;
        await delay(STEP_DELAY_MS);
      }
      dispatch(setIsAnimating(false));

      // Check lines
      const {newBoard, linesFound, scoreIncrement} = findAndRemoveLines(getState().gameBoard.board);
      dispatch(changeBoard(newBoard));
      if (scoreIncrement > 0) {
        dispatch(incrementScore(scoreIncrement));
      }

      if (linesFound) {
        dispatch(incrementMoveNumber());
        return;
      }

      const emptyFields = () =>
        getState()
          .gameBoard.board.flat()
          .filter((x) => !x.ball);
      if (emptyFields().length <= 0) {
        await dispatch(restartGameAndTrySendResultToGoogle());
        return;
      }

      // Compute seeded placement for this move
      const {gameSeed, moveNumber} = getState().gameBoard;
      const rng = seededRandom(((gameSeed ^ (moveNumber * 1664525 + 1013904223)) >>> 0));
      const currentBoard = getState().gameBoard.board;
      const currentNextBalls = (getState().gameBoard.boardWithNextBalls as Ball[]).filter(Boolean);
      const placedFields = placeNewBallsOnBoards(currentBoard, currentNextBalls, rng);
      const nextBalls = generateNewBalls(3, rng);

      dispatch(placeBallsAndGenerateNextBalls({placedFields, nextBalls}));
      dispatch(incrementMoveNumber());

      // Check lines after placing new balls
      const result2 = findAndRemoveLines(getState().gameBoard.board);
      dispatch(changeBoard(result2.newBoard));
      if (result2.scoreIncrement > 0) {
        dispatch(incrementScore(result2.scoreIncrement));
      }

      if (emptyFields().length <= 0) {
        await dispatch(restartGameAndTrySendResultToGoogle());
      }
    }
  },
);

export const trySendResultToGoogle = createAsyncThunk<void, void, {state: RootState}>(
  `${baseType}TRY_SEND_RESULT_TO_GOOGLE`,
  async (_, {getState}) => {
    const {
      gameBoard: {score},
      google: {user},
    } = getState();
    if (user !== null && score.currentScore > score.bestScore) {
      updateScore(user.email as string, score.currentScore, user.displayName, user.photoURL);
    }
  },
);

export const trySendResultToGoogleAfterLogin = createAsyncThunk<void, void, {state: RootState}>(
  `${baseType}TRY_SEND_RESULT_TO_GOOGLE_AFTER_LOGIN`,
  async (_, {getState}) => {
    const {
      gameBoard: {score},
      google: {user},
    } = getState();
    if (user !== null && score.bestScore) {
      updateScore(user.email as string, score.bestScore, user.displayName, user.photoURL);
    }
  },
);

export const getScoreFromGoogle = createAsyncThunk<void, void, {state: RootState}>(
  `${baseType}GET_SCORE_FROM_GOOGLE`,
  async (_, {dispatch, getState}) => {
    const {
      gameBoard: {score},
      google: {user},
    } = getState();
    if (user !== null) {
      const scoreFromGoogle = await getScore(user.email as string);
      if (scoreFromGoogle && scoreFromGoogle > score.bestScore) {
        dispatch(applyBestScore(scoreFromGoogle));
      }
    }
  },
);

export const restartGameAndTrySendResultToGoogle = createAsyncThunk<void, void, {state: RootState}>(
  `${baseType}RESTART_GAME_AND_TRY_SEND_RESULT_TO_GOOGLE`,
  async (_, {dispatch}) => {
    await dispatch(trySendResultToGoogle());
    dispatch(restartGame());
  },
);
