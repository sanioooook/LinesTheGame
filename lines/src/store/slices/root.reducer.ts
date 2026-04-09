import gameBoardReducer from './gameBoard.slice';
import googleReducer from './google.slice';
import leaderboardReducer from './leaderboard.slice';
import {combineReducers} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  gameBoard: gameBoardReducer,
  google: googleReducer,
  leaderboard: leaderboardReducer,
});

export default rootReducer;
