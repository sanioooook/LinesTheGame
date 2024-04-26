import React from 'react';
import {Field} from '../../types/field.type';
import {BallComponent} from '../Ball/BallComponent';

export interface FieldProps {
  field: Field;
  onSelectBall: (field: Field) => void;
  onClickForMoveBall: (field: Field) => void;
  canBeClicked?: boolean;
}

export const FieldComponent: React.FC<FieldProps> = ({
  field,
  onSelectBall,
  onClickForMoveBall,
  canBeClicked = true,
}) => {
  let contentWithBall;
  const handleSelectBall = () => {
    onSelectBall(field);
  };
  if (field.ball) {
    contentWithBall = (
      <BallComponent
        ball={field.ball}
        onSelectBall={handleSelectBall}
        canBeSelected={canBeClicked}
      />
    );
  } else {
    contentWithBall = <div />;
  }
  return (
    <div
      className={`field`}
      onClick={() => (!field.ball ? onClickForMoveBall(field) : undefined)}
    >
      {contentWithBall}
    </div>
  );
};
