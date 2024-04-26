import {createSlice, Slice} from '@reduxjs/toolkit';
import {errorSignIn, errorSignOut, successSignIn, successSignOut} from '../actions/google.actions';
import {GoogleAuthProvider} from 'firebase/auth';
import {UserInfo} from '@firebase/auth';

export type InitialState = {
  user: UserInfo | null;
  accessToken: string | undefined;
};

export const initialState: InitialState = {
  user: null,
  accessToken: undefined,
};

export const googleSlice: Slice<InitialState, {}, 'google'> = createSlice({
  name: 'google',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(successSignIn, (state, {payload}) => {
        /*const credential = GoogleAuthProvider.credentialFromResult(payload);
        // This gives you a Google Access Token. You can use it to access the Google API.
        state.accessToken = credential?.accessToken;*/
        // The signed-in user info.
        state.user = {...payload};
      })
      .addCase(errorSignIn, (_, {payload}) => {
        const errorCode = payload.code;
        const errorMessage = payload.message;
        // The email of the user's account used.
        const email = payload.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(payload);
        console.error(`${errorCode} ${errorMessage} \nAdditional info credential: ${credential}; email: ${email}`);
      })
      .addCase(successSignOut, (state) => {
        state.accessToken = initialState.accessToken;
        state.user = initialState.user;
      })
      .addCase(errorSignOut, (_, {payload}) => {
        console.error({...payload});
      });
  },
});

export default googleSlice.reducer;
