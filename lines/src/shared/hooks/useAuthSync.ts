import {useEffect} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../../firebase/firebase';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {successSignIn, successSignOut} from '../../store/actions/google.actions';
import {applyBestScore, applyLatestScore, getScoreFromGoogle} from '../../store/actions/gameBoard.actions';

/**
 * Subscribes to Firebase Auth state changes.
 *
 * Handles cases where the session becomes invalid outside the app:
 * - User deleted from Firebase / Google Console
 * - OAuth access revoked in Google Account settings
 * - Token refresh failure after 1-hour expiry
 *
 * Firebase Auth SDK detects all of these and fires onAuthStateChanged(null).
 * Without this hook the Redux state would still show the user as signed in.
 */
export function useAuthSync() {
  const dispatch = useAppDispatch();
  const storedUser = useAppSelector((state) => state.google.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser === null && storedUser !== null) {
        // Session expired / user deleted / access revoked — force local sign-out
        dispatch(successSignOut());
        dispatch(applyBestScore(0));
        dispatch(applyLatestScore(0));
      } else if (firebaseUser !== null) {
        // Keep Redux in sync with the latest profile info from Firebase
        // (covers displayName / photoURL changes and token refreshes)
        dispatch(
          successSignIn({
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            displayName: firebaseUser.displayName,
            uid: firebaseUser.uid,
            providerId: firebaseUser.providerId,
            phoneNumber: firebaseUser.phoneNumber ?? '',
          }),
        );
        dispatch(getScoreFromGoogle());
      }
    });

    return () => unsubscribe();
    // storedUser intentionally omitted: we only want one subscription for the app lifetime.
    // The callback always reads the latest Redux state via dispatch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
}
