import {useAppDispatch} from '../../store/hooks';
import {Field} from '../../types/field.type';
import {changeSelectedBall, moveBallAndCheckLines, restartGameAndTrySendResultToGoogle} from '../../store/actions/gameBoard.actions';

export function useGameBoardActions() {
  const dispatch = useAppDispatch();
  return {
    moveBall: (field: Field) => dispatch(moveBallAndCheckLines(field)),
    selectBall: (field: Field) => dispatch(changeSelectedBall(field)),
    restart: () => dispatch(restartGameAndTrySendResultToGoogle()),
  };
}
