import gameBoardReducer from './gameBoard.slice';
import googleReducer from './google.slice';
import {combineReducers} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  gameBoard: gameBoardReducer,
  google: googleReducer,
});

export default rootReducer;
