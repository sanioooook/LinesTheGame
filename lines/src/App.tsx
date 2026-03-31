import React, {useState} from 'react';
import './App.scss';
import {changeLanguage} from './store/actions/gameBoard.actions';
import {GameBoard} from './types/gameBoard.type';
import {useAppDispatch, useAppSelector} from './store/hooks';
import {BoardWithNextBallsComponent} from './components/BoardWithNextBalls/BoardWithNextBallsComponent';
import {ScoreComponent} from './components/Score/ScoreComponent';
import './i18n';
import {useTranslation} from 'react-i18next';
import svgRestart from './svg/autorenew_white_24dp.svg';
import LanguageSelect from './components/LanguageSelect/LanguageSelect';
import Modal from './shared/components/Modal/Modal';
import GoogleSignInButton from './components/GoogleSignInButton/GoogleSignInButton';
import {RulesComponent} from './components/Rules/RulesComponent';
import {useAutoUpdateScore} from './shared/hooks/useAutoUpdateScore';
import {useGameBoardActions} from './shared/hooks/useGameBoardActions';
import {useStartGameOnEmptyBoard} from './shared/hooks/useStartGameOnEmptyBoard';
import {useSyncLanguageEffect} from './shared/hooks/useSyncLanguageEffect';
import {availableLanguages} from './constants/languages';
import {Ball} from './types/ball.type';
import GameBoardComponent from './components/GameBoard/GameBoard';

export const App: React.FC = () => {
  const {t} = useTranslation();
  const board: GameBoard = useAppSelector((state) => state.gameBoard.board);
  const boardWithNextBalls = useAppSelector((state) => state.gameBoard.boardWithNextBalls);
  const scores = useAppSelector((state) => state.gameBoard.score);
  const language = useAppSelector((state) => state.gameBoard.selectedLanguage);
  const shakingField = useAppSelector((state) => state.gameBoard.animation?.shakingField ?? null);
  const dispatch = useAppDispatch();
  const {moveBall, selectBall, restart} = useGameBoardActions();
  const [isModalRulesOpen, setIsModalRulesOpen] = useState(false);

  useAutoUpdateScore();
  useStartGameOnEmptyBoard();
  useSyncLanguageEffect();

  return (
    <div className={`main`}>
      <div className={`navigations`}>
        <div className={`score-component`}>
          <ScoreComponent score={scores} />
        </div>
        <div className={`buttons-and-selector`}>
          <LanguageSelect
            languages={availableLanguages}
            selectedLanguage={language}
            onLanguageChange={(newLanguage) => dispatch(changeLanguage(newLanguage))}
          />

          <button className={`button`} onClick={() => setIsModalRulesOpen(true)}>
            {t('openRules')}
          </button>
          <Modal isOpen={isModalRulesOpen} onClose={() => setIsModalRulesOpen(false)} component={<RulesComponent />} title={t('rules')} />
          <button className={'button'} onClick={restart}>
            <img className={'icon'} src={svgRestart} alt={''} />
            {t('restart')}
          </button>
        </div>
      </div>
      <div className={`centered-game-board`}>
        <BoardWithNextBallsComponent boardWithNextBalls={boardWithNextBalls as Ball[]} />
        <GameBoardComponent board={board} onSelectBall={selectBall} onClickForMoveBall={moveBall} shakingField={shakingField} />
      </div>
      <GoogleSignInButton />
    </div>
  );
};
