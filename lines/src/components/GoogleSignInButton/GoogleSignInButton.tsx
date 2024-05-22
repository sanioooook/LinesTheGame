import React, {useState} from 'react';
import './GoogleSignInButton.scss';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {signIn, signOut} from '../../store/actions/google.actions';
import {useTranslation} from 'react-i18next';
import svgSignOut from '../../svg/sign-out.svg';
import avatar from '../../svg/avatar.svg';
import Modal from '../Modal/Modal';

const GoogleSignInButton = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.google.user);
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalConfirmationOpen(true);
  };

  const handleCloseModal = (logout: boolean = false) => {
    setIsModalConfirmationOpen(false);
    if(logout)
      dispatch(signOut());
  };

  const confirmation = <div className="confirmation-container">
    <button className="logout-button" onClick={() =>  handleCloseModal(true)}>
      {t('Log out')}
    </button>
    <button className="stay-button" onClick={() => handleCloseModal()}>
      {t('Stay')}
    </button>
  </div>
  const renderButton = () => {
    if (user !== null) {
      return <>
        <button className="google-sign-in-button" onClick={() => handleOpenModal()}>
          <img src={user.photoURL ?? avatar} alt="Google avatar"/>
          {user.displayName}
          <img className={'icon'} src={svgSignOut} alt={''}/>
        </button>
        <Modal
          isOpen={isModalConfirmationOpen}
          onClose={() => handleCloseModal(false)}
          component={confirmation}
          title={t('Are you sure you want log out?')}
        />
      </>;
    } else {
      return <button className="google-sign-in-button" onClick={() => dispatch(signIn())}>
        <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google Sign-In"/>
        {t('Sign in with Google')}
      </button>;
    }
  };

  return (<>
      {renderButton()}
    </>
  );
};

export default GoogleSignInButton;
