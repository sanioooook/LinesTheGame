import gameBoardReducer from './gameBoard.slice';
import {combineReducers} from "@reduxjs/toolkit";

const rootReducer =
    combineReducers({
        gameBoard: gameBoardReducer,
    });

export default rootReducer;
