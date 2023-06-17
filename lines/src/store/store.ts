import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./slices/root.reducer";
import {InitialState, initialState as initialStateFromStore} from './slices/gameBoard.slice'
import CryptoJS from "crypto-js";
const secretKey = process.env.REACT_APP_SECRET_KEY ?? 'secret';

const loadFromLocalStorage = (): InitialState => {
    const serializedState = localStorage.getItem('gameState');
    if (serializedState) {
        const bytes = CryptoJS.AES.decrypt(serializedState, secretKey);
        const originalState = bytes.toString(CryptoJS.enc.Utf8);
        const parsedState: {gameState: InitialState} = JSON.parse(originalState);
        return parsedState.gameState;
    } else {
        return initialStateFromStore
    }
};

const initialState = loadFromLocalStorage();

const saveToLocalStorage = (store: { getState: () => any; }) => (next: (arg0: any) => any) => (action: any) => {
    const result = next(action);
    const serializedState = JSON.stringify(store.getState());
    const encryptedState = CryptoJS.AES.encrypt(serializedState, secretKey).toString();
    localStorage.setItem('gameState', encryptedState);
    return result;
};

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState: {
        gameBoard: initialState
    },
    middleware: [saveToLocalStorage]
});

export default store;


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
