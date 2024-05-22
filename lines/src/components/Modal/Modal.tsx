import React from 'react';
import './Modal.scss';
import {useTranslation} from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, component, title}) => {
  const {t} = useTranslation();
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {component}
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
