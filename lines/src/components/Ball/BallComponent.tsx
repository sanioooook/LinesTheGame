import React from 'react';
import {Ball} from '../../interfaces/IBall';
import {BallColor} from '../../types/ballColor.enum';

export interface BallComponentProps {
  ball: Ball;
  onSelectBall: () => any;
  canBeSelected?: boolean;
}

export const BallComponent: React.FC<BallComponentProps> = ({
  ball,
  onSelectBall,
  canBeSelected = true,
}: BallComponentProps) => {
  let content;
  if (canBeSelected) {
    content = (
      <div
        className={`ball ball-${BallColor[ball.color].toString()} ${ball.isSelected ? 'ball-selected' : ''}`}
        onClick={onSelectBall}
      />
    );
  } else {
    content = (
      <div className={`ball ball-${BallColor[ball.color].toString()}`} />
    );
  }
  return content;
};
