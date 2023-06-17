import React, {useEffect} from 'react';
import './App.scss';
import {GameBoardComponent} from './components/gameBoard/GameBoard'
import {Field} from "./types/field.type";
import {
    changeSelectedBall,
    moveBallAndCheckLines, restartGame,
    startGame
} from "./store/actions/gameBoard.actions";
import {GameBoard} from "./types/gameBoard.type";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import {BoardWithNextBallsComponent} from "./components/BoardWithNextBalls/BoardWithNextBallsComponent";
import {ScoreComponent} from "./components/Score/ScoreComponent";
import svgRestart from './svg/restart_alt_black_24dp.svg';

export const App: React.FC = () => {
    const board: GameBoard = useAppSelector((state) => state.gameBoard.board)
    const boardWithNextBalls = useAppSelector((state) => state.gameBoard.boardWithNextBalls)
    const scores = useAppSelector((state) => state.gameBoard.score)
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(board.flat().filter(x => x.ball).length === 0) {
            dispatch(startGame());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectBall = (field: Field) => {
        dispatch(changeSelectedBall(field));
    }

    const handleMoveBall = (field: Field) => {
        // @ts-ignore
        dispatch(moveBallAndCheckLines(field));
    }

    const handleClickRestart = () => {
        dispatch(restartGame());
    }
    return (
        <>
            <div className={`score-component`}>
                <ScoreComponent score={scores}/>
            </div>
            <div className={`centered-game-board`}>
                <BoardWithNextBallsComponent
                    boardWithNextBalls={boardWithNextBalls}/>
                <GameBoardComponent
                    board={board}
                    onSelectBall={handleSelectBall}
                    onClickForMoveBall={handleMoveBall}/>
            </div>
            <button onClick={handleClickRestart}><img src={svgRestart} alt={''}/>Restart game</button>
        </>
    );
}
