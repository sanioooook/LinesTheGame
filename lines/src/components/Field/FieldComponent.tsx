import React, {useCallback} from 'react';
import {Field} from '../../types/field.type';
import {BallComponent} from '../Ball/BallComponent';

export interface FieldProps {
  field: Field;
  onSelectBall: (field: Field) => void;
  onClickForMoveBall: (field: Field) => void;
  canBeClicked?: boolean;
}

export const FieldComponent: React.FC<FieldProps> = ({field, onSelectBall, onClickForMoveBall, canBeClicked = true}) => {
  const handleSelectBall = useCallback(() => {
    onSelectBall(field);
  }, [field, onSelectBall]);
  return (
    <div className={`field`} onClick={() => (!field.ball ? onClickForMoveBall(field) : undefined)}>
      {field.ball ? <BallComponent ball={field.ball} onSelectBall={handleSelectBall} canBeSelected={canBeClicked} /> : <div />}
    </div>
  );
};
