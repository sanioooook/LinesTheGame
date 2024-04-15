import {Ball} from "../interfaces/IBall";
import {BallColor} from "../types/ballColor.enum";
import {GameBoard} from "../types/gameBoard.type";
import {Field} from "../types/field.type";

export function placeNewBallsOnBoards(board: GameBoard, balls: Ball[]): Field[] {
    const freeFields: Field[] = [...board.flat().filter((field) => !field.ball)];
    const fields: Field[] = [];
    for (let i = 0; i < (freeFields.length <= 3 ? freeFields.length + 1 : balls.length); i++) {
        const field = freeFields[Math.floor(Math.random() * freeFields.length)];
        fields.push({...field, ball: balls[i]});
        const index = freeFields.findIndex(x => x.j === field.j && x.i === field.i);
        if (index !== -1) {
            freeFields.splice(index, 1);
        }
    }

    return fields;
}

export function generateNewBalls(count: number): Ball[] {
    const balls: Ball[] = [];

    for (let i = 0; i < count; i++) {
        const color = Math.floor(Math.random() * Object.keys(BallColor).length / 2) as BallColor;
        balls.push({color, isSelected: false});
    }

    return balls;
}
