import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Field} from "../../types/field.type";
import {RootState} from "../store";
import {isPathBetween} from "../../helpers/BFSAlgorithm.helper";
import {GameBoard} from "../../types/gameBoard.type";

const baseType = 'GAME_BOARD/'

export const changeSelectedBall = createAction<Field>(`${baseType}CHANGE_SELECTED`);
export const changeBoard = createAction<GameBoard>(`${baseType}CHANGE_BOARD`);
export const moveBall = createAction<Field>(`${baseType}MOVE_BALL`);
export const startGame = createAction(`${baseType}START_GAME`);
export const restartGame = createAction(`${baseType}RESTART_GAME`);
export const placeBallsAndGenerateNextBalls = createAction(`${baseType}PLACE_BALLS_AND_GENERATE_NEXT_BALLS`);
export const incrementScore = createAction<number>(`${baseType}INCREMENT_SCORE`)
export const moveBallAndCheckLinesType = `${baseType}MOVE_BALL_AND_CHECK_LINES`;

export const moveBallAndCheckLines = createAsyncThunk<void, Field, { state: RootState }>(
    moveBallAndCheckLinesType,
    async (endField, {dispatch, getState}) => {
        let {gameBoard: {currentSelectedField, board}} = getState();

        if (currentSelectedField && currentSelectedField.ball) {
            // Check if the end field is free
            if (endField.ball !== null) {
                return;
            }

            // Check if there is a path between start and end field
            if (!isPathBetween(currentSelectedField, endField, board)) {
                return;
            }

            // Move the ball
            await dispatch(moveBall(endField));

            // Check lines
            const lineFounded = await dispatch(checkLines());

            // if arrays not eq - board changed, some elements deleted
            if (lineFounded.payload === true) {
                return;
            }

            board = getState().gameBoard.board;
            const emptyFields = () => board.flat().filter(x => !x.ball);
            if(emptyFields().length <= 0) {
                await dispatch(restartGame());
            }

            // Add new balls
            await dispatch(placeBallsAndGenerateNextBalls());
            await dispatch(checkLines());
            board = getState().gameBoard.board;
            if(emptyFields().length <= 0) {
                await dispatch(restartGame());
            }
        }
    }
);

export const checkLines = createAsyncThunk<boolean, void, { state: RootState }>(
    `${baseType}CHECK_LINES`,
    async (_, {dispatch, getState}) =>
    {
        let lineFounded = false;
        const {gameBoard: {board}} = getState();

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]; // Up, Down, Left, Right, Diagonals
        let newBoard: GameBoard = board.map(row => row.map(cell => ({...cell})));

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (newBoard[i][j].ball !== null) {
                    const color = newBoard[i][j].ball?.color;

                    for (const [di, dj] of directions) {
                        let line = [{i, j}];

                        let step = 1;
                        while (true) { // Change this to an infinite loop
                            const ni = i + step * di, nj = j + step * dj;

                            if (ni >= 0 && ni < 9 && nj >= 0 && nj < 9 && newBoard[ni][nj].ball?.color === color) {
                                line.push({i: ni, j: nj});
                            } else {
                                break; // Exit the loop if out of bounds or different color
                            }

                            step++; // Increment step
                        }

                        if (line.length >= 5) {
                            for (const {i, j} of line) {
                                newBoard[i][j].ball = null;
                            }
                            await dispatch(incrementScore(line.length));
                            lineFounded = true;
                        }
                    }
                }
            }
        }

        await dispatch(changeBoard(newBoard));
        return lineFounded;
    }
);
