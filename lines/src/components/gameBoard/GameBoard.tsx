import {GameBoard} from "../../types/gameBoard.type";
import React from "react";
import {Field} from "../../types/field.type";
import {FieldComponent} from "../Field/FieldComponent";

export type GameBoardProps = {
    board: GameBoard,
    onSelectBall: (field: Field) => void,
    onClickForMoveBall: (field: Field) => void,
}

export const GameBoardComponent: React.FC<GameBoardProps>
    = ({board, onSelectBall, onClickForMoveBall}) => {
    return (
        <div className="game-board">
            {board.map((row) =>
                row.map((field) =>
                    <FieldComponent
                        field={field}
                        onSelectBall={onSelectBall}
                        onClickForMoveBall={onClickForMoveBall}
                        key={`${field.i}-${field.j}`}
                    />)
            )}
        </div>
    );
}
