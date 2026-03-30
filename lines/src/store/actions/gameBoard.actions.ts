import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import {Field} from '../../types/field.type';
import {RootState} from '../store';
import {isPathBetween, findAndRemoveLines} from '../../helpers/BFSAlgorithm.helper';
import {GameBoard} from '../../types/gameBoard.type';
import {LanguagesEnum} from '../../types/languages.enum';
import {updateScore, getScore} from '../../firebase/functions/function-helper';

const baseType = 'GAME_BOARD/';

export const changeSelectedBall = createAction<Field>(`${baseType}CHANGE_SELECTED`);
export const changeBoard = createAction<GameBoard>(`${baseType}CHANGE_BOARD`);
export const moveBall = createAction<Field>(`${baseType}MOVE_BALL`);
export const startGame = createAction(`${baseType}START_GAME`);
export const restartGame = createAction(`${baseType}RESTART_GAME`);
export const applyBestScore = createAction<number>(`${baseType}APPLY_BEST_SCORE`);
export const applyLatestScore = createAction<number>(`${baseType}APPLY_LATEST_SCORE`);
export const placeBallsAndGenerateNextBalls = createAction(`${baseType}PLACE_BALLS_AND_GENERATE_NEXT_BALLS`);
export const incrementScore = createAction<number>(`${baseType}INCREMENT_SCORE`);
export const changeLanguage = createAction<LanguagesEnum>(`${baseType}CHANGE_LANGUAGE`);

export const moveBallAndCheckLines = createAsyncThunk<void, Field, {state: RootState}>(
  `${baseType}MOVE_BALL_AND_CHECK_LINES`,
  async (endField, {dispatch, getState}) => {
    const {currentSelectedField} = getState().gameBoard;

    if (currentSelectedField && currentSelectedField.ball) {
      // Check if the end field is free
      if (endField.ball !== null) {
        return;
      }

      // Check if there is a path between start and end field
      if (!isPathBetween(currentSelectedField, endField, getState().gameBoard.board)) {
        return;
      }

      // Move the ball
      dispatch(moveBall(endField));

      // Check lines
      const {newBoard, linesFound, scoreIncrement} = findAndRemoveLines(getState().gameBoard.board);
      dispatch(changeBoard(newBoard));
      if (scoreIncrement > 0) {
        dispatch(incrementScore(scoreIncrement));
      }

      if (linesFound) {
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

      // Add new balls
      dispatch(placeBallsAndGenerateNextBalls());

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
      updateScore(user.email as string, score.currentScore);
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
      updateScore(user.email as string, score.bestScore);
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
