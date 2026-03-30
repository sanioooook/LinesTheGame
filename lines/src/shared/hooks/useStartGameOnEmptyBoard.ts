import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {startGame} from '../../store/actions/gameBoard.actions';

export const useStartGameOnEmptyBoard = () => {
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.gameBoard.board);

  useEffect(() => {
    const isBoardEmpty = board.flat().every((field) => !field.ball);
    if (isBoardEmpty) {
      dispatch(startGame());
    }
  }, [board, dispatch]);
};
