import React, {useEffect, useState} from 'react';
import './App.scss';
import {GameBoardComponent} from './components/GameBoard/GameBoard';
import {Field} from './types/field.type';
import {
  changeLanguage,
  changeSelectedBall, getScoreFromGoogle,
  moveBallAndCheckLines,
  restartGameAndTrySendResultToGoogle,
  startGame,
} from './store/actions/gameBoard.actions';
import {GameBoard} from './types/gameBoard.type';
import {useAppDispatch, useAppSelector} from './store/hooks';
import {BoardWithNextBallsComponent} from './components/BoardWithNextBalls/BoardWithNextBallsComponent';
import {ScoreComponent} from './components/Score/ScoreComponent';
import './i18n';
import {useTranslation} from 'react-i18next';
import svgRestart from './svg/autorenew_white_24dp.svg';
import LanguageSelect from './components/LanguageSelect/LanguageSelect';
import {LanguagesEnum} from './types/languages.enum';
import Modal from './components/Modal/Modal';
import GoogleSignInButton from './components/GoogleSignInButton/GoogleSignInButton';
import {RulesComponent} from './components/Rules/RulesComponent';

export const App: React.FC = () => {
  const {t} = useTranslation();
  const board: GameBoard = useAppSelector((state) => state.gameBoard.board);
  const boardWithNextBalls = useAppSelector(
    (state) => state.gameBoard.boardWithNextBalls
  );
  const scores = useAppSelector((state) => state.gameBoard.score);
  const language = useAppSelector((state) => state.gameBoard.selectedLanguage);
  const dispatch = useAppDispatch();
  const [isModalRulesOpen, setIsModalRulesOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalRulesOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalRulesOpen(false);
  };
  useEffect(() => {
    dispatch(getScoreFromGoogle());
    const intervalId = setInterval(() => {
      dispatch(getScoreFromGoogle());
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (board.flat().filter((x) => x.ball).length === 0) {
      dispatch(startGame());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(changeLanguage(language));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleLanguageChange = (newLanguage: LanguagesEnum) => {
    dispatch(changeLanguage(newLanguage));
  };

  const handleSelectBall = (field: Field) => {
    dispatch(changeSelectedBall(field));
  };

  const handleMoveBall = (field: Field) => {
    // @ts-ignore
    dispatch(moveBallAndCheckLines(field));
  };

  const handleClickRestart = () => {
    dispatch(restartGameAndTrySendResultToGoogle());
  };
  return (
    <div className={`main`}>
      <div className={`navigations`}>
        <div className={`score-component`}>
          <ScoreComponent score={scores} />
        </div>
        <div className={`buttons-and-selector`}>
          <LanguageSelect
            languages={[
              {value: LanguagesEnum.en, label: 'English'},
              {value: LanguagesEnum.ru, label: 'Russian'},
              {value: LanguagesEnum.ua, label: 'Ukrainian'},
            ]}
            selectedLanguage={language}
            onLanguageChange={handleLanguageChange}
          />

          <button className={`button`} onClick={handleOpenModal}>
            {t('openRules')}
          </button>
          <Modal
            isOpen={isModalRulesOpen}
            onClose={handleCloseModal}
            component={<RulesComponent/>}
            title={t('rules')}
          />
          <button className={'button'} onClick={handleClickRestart}>
            <img className={'icon'} src={svgRestart} alt={''} />
            {t('restart')}
          </button>
        </div>
      </div>
      <div className={`centered-game-board`}>
        <BoardWithNextBallsComponent boardWithNextBalls={boardWithNextBalls} />
        <GameBoardComponent
          board={board}
          onSelectBall={handleSelectBall}
          onClickForMoveBall={handleMoveBall}
        />
      </div>
      <GoogleSignInButton/>
    </div>
  );
};
