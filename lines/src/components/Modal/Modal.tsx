import React from 'react';
import './Modal.scss';
import {RulesComponent} from '../Rules/RulesComponent';
import {useTranslation} from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose}) => {
  const {t} = useTranslation();
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{t('rules')}</span>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <RulesComponent />
        </div>
        <div className="modal-footer">
          <button className="close-button" onClick={onClose}>
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
