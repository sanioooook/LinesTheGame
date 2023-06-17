import React from "react";
import './ScoreComponent.scss';

export interface ScoreComponentProps {
    score: {
        currentScore: number;
        bestScore: number,
        latestScore: number,
    }
}

export const ScoreComponent: React.FC<ScoreComponentProps> = ({score}) => {
    return  <div className={`scores`}>
        <span>Current score {score.currentScore}</span>
        <span>Last score {score.latestScore}</span>
        <span>Best score {score.bestScore}</span>
    </div>
}
