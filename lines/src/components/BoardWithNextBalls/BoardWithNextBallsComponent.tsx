import React from "react";
import {FieldComponent} from "../Field/FieldComponent";
import {Ball} from "../../interfaces/IBall";
import './BoardWithNextBallsComponent.scss'

export type BoardWithNextBallsProps = {
    boardWithNextBalls: Ball[],
}

export const BoardWithNextBallsComponent: React.FC<BoardWithNextBallsProps>
    = ({boardWithNextBalls}) => {
    return (
        <div className="board-with-next-balls">
            {boardWithNextBalls
                .map((ball, i) =>
                    <FieldComponent
                        field={{ball: ball,i: 0, j: i}}
                        canBeClicked={false}
                        onClickForMoveBall={() => undefined}
                        onSelectBall={() => undefined}
                        key={i}/>)
            }
        </div>
    );
}
