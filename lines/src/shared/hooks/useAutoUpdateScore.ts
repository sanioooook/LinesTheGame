import {useAppDispatch} from '../../store/hooks';
import {getScoreFromGoogle} from '../../store/actions/gameBoard.actions';
import {useEffect} from 'react';

export function useAutoUpdateScore() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getScoreFromGoogle());
    const intervalId = setInterval(
      () => {
        dispatch(getScoreFromGoogle());
      },
      5 * 60 * 1000,
    );
    return () => clearInterval(intervalId);
  }, [dispatch]);
}
