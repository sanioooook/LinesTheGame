import {createSlice} from '@reduxjs/toolkit';
import {LeaderboardEntry} from '../../firebase/functions/function-helper';
import {fetchLeaderboard} from '../actions/leaderboard.actions';

type LeaderboardState = {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  hasError: boolean;
};

const initialState: LeaderboardState = {
  entries: [],
  isLoading: false,
  hasError: false,
};

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, {payload}) => {
        state.entries = payload;
        state.isLoading = false;
      })
      .addCase(fetchLeaderboard.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export default leaderboardSlice.reducer;
