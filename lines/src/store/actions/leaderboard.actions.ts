import {createAsyncThunk} from '@reduxjs/toolkit';
import {getLeaderboard, LeaderboardEntry} from '../../firebase/functions/function-helper';

export const fetchLeaderboard = createAsyncThunk<LeaderboardEntry[]>('LEADERBOARD/FETCH', () => getLeaderboard());
