import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import {signInWithPopup, UserInfo, signOut as firebaseSignOut} from 'firebase/auth';
import {RootState} from '../store';
import {auth, provider} from '../../firebase/firebase';
import {
  applyBestScore,
  applyLatestScore,
  getScoreFromGoogle,
  trySendResultToGoogleAfterLogin,
} from './gameBoard.actions';

const baseType = 'GOOGLE/';

export const successSignIn = createAction<UserInfo>(
  `${baseType}SUCCESS_SIGN_IN`,
);
export const errorSignIn = createAction<any>(
  `${baseType}ERROR_SIGN_IN`,
);
export const successSignOut = createAction(
  `${baseType}SUCCESS_SIGN_OUT`,
);
export const errorSignOut = createAction<any>(
  `${baseType}ERROR_SIGN_OUT`,
);

export const signIn = createAsyncThunk<void, void, {state: RootState}>(
  `${baseType}SIGN_IN`,
  async (_, {dispatch}) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch(successSignIn({
          email: result.user.email,
          photoURL: result.user.photoURL,
          displayName: result.user.displayName,
          uid: result.user.uid,
          providerId: result.user.providerId,
          phoneNumber: '',
        }));
        dispatch(getScoreFromGoogle());
        dispatch(trySendResultToGoogleAfterLogin());
      })
      .catch((error) => {
        dispatch(errorSignIn(error));
      });
  }
);
export const signOut = createAsyncThunk<void, void, {state: RootState}>(
  `${baseType}SIGN_OUT`,
  async (_, {dispatch}) => {
    firebaseSignOut(auth)
      .then(() => {
        dispatch(successSignOut());
        dispatch(applyLatestScore(0));
        dispatch(applyBestScore(0));
      })
      .catch((error) => {
        dispatch(errorSignOut(error));
      });
  }
);
