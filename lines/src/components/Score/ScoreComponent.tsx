import React from 'react';
import {useTranslation} from 'react-i18next';

export interface ScoreComponentProps {
  score: {
    currentScore: number;
    bestScore: number;
    latestScore: number;
  };
}

export const ScoreComponent: React.FC<ScoreComponentProps> = ({score}) => {
  const {t} = useTranslation();
  return (
    <div className={`scores`}>
      <span>
        {t('currentScore')} {score.currentScore}
      </span>
      <span>
        {t('lastScore')} {score.latestScore}
      </span>
      <span>
        {t('bestScore')} {score.bestScore}
      </span>
    </div>
  );
};
