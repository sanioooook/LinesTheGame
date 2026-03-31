import {GameBoard} from '../../types/gameBoard.type';
import React from 'react';
import {Field} from '../../types/field.type';
import {FieldComponent} from '../Field/FieldComponent';

export type GameBoardProps = {
  board: GameBoard;
  onSelectBall: (field: Field) => void;
  onClickForMoveBall: (field: Field) => void;
  shakingField?: {i: number; j: number} | null;
};

const GameBoardComponent: React.FC<GameBoardProps> = ({board, onSelectBall, onClickForMoveBall, shakingField}) => {
  return (
    <div className="game-board">
      {board.map((row) =>
        row.map((field) => (
          <FieldComponent
            field={field}
            onSelectBall={onSelectBall}
            onClickForMoveBall={onClickForMoveBall}
            isShaking={shakingField?.i === field.i && shakingField?.j === field.j}
            key={`${field.i}-${field.j}`}
          />
        )),
      )}
    </div>
  );
};

GameBoardComponent.displayName = 'GameBoardComponent';
export default React.memo(GameBoardComponent);
