import {createAsyncThunk} from '@reduxjs/toolkit';
import {getLeaderboard, LeaderboardEntry} from '../../firebase/functions/function-helper';

export const fetchLeaderboard = createAsyncThunk<LeaderboardEntry[]>('LEADERBOARD/FETCH', () =>
  getLeaderboard().catch((error) => {
    console.error('Failed to load leaderboard:', error);
    throw error;
  }),
);
