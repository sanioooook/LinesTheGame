import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {Field} from '../../types/field.type';
import {changeSelectedBall, moveBallAndCheckLines, restartGameAndTrySendResultToGoogle} from '../../store/actions/gameBoard.actions';

export function useGameBoardActions() {
  const dispatch = useAppDispatch();
  const isAnimating = useAppSelector((state) => state.gameBoard.animation?.isAnimating ?? false);
  return {
    moveBall: (field: Field) => {
      if (!isAnimating) dispatch(moveBallAndCheckLines(field));
    },
    selectBall: (field: Field) => {
      if (!isAnimating) dispatch(changeSelectedBall(field));
    },
    restart: () => dispatch(restartGameAndTrySendResultToGoogle()),
  };
}
