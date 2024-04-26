import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import rootReducer from './slices/root.reducer';
import {
  InitialState as GameBoardInitialState,
  initialState as gameBoardInitialStateFromStore,
} from './slices/gameBoard.slice';
import {
  InitialState as GoogleInitialState,
  initialState as googleInitialStateFromStore,
} from './slices/google.slice';
import CryptoJS from 'crypto-js';
const secretKey = process.env.REACT_APP_SECRET_KEY ?? 'secret';

const loadFromLocalStorage = (): {gameBoard: GameBoardInitialState, google: GoogleInitialState } => {
  const serializedState = localStorage.getItem('gameState');
  if (serializedState) {
    const bytes = CryptoJS.AES.decrypt(serializedState, secretKey);
    const originalState = bytes.toString(CryptoJS.enc.Utf8);
    const parsedState: {gameBoard: GameBoardInitialState, google: GoogleInitialState} = JSON.parse(originalState);
    return {gameBoard: parsedState.gameBoard, google: parsedState.google};
  } else {
    return {gameBoard: gameBoardInitialStateFromStore, google: googleInitialStateFromStore};
  }
};

const initialStateGameBoard = loadFromLocalStorage();

const saveToLocalStorage =
  (store: {getState: () => any}) =>
  (next: (arg0: any) => any) =>
  (action: any) => {
    const result = next(action);
    const serializedState = JSON.stringify(store.getState());
    const encryptedState = CryptoJS.AES.encrypt(
      serializedState,
      secretKey
    ).toString();
    localStorage.setItem('gameState', encryptedState);
    return result;
  };

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  preloadedState: {
    gameBoard: initialStateGameBoard.gameBoard,
    google: initialStateGameBoard.google,
  },
  middleware: getDefaultMiddleware().concat(saveToLocalStorage),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
