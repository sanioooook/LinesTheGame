import React from 'react';
import './GoogleSignInButton.scss';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {signIn, signOut} from '../../store/actions/google.actions';
import {useTranslation} from 'react-i18next';
import svgSignOut from '../../svg/sign-out.svg';
import avatar from '../../svg/avatar.svg';

const GoogleSignInButton = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.google.user);
  const renderButton = () => {
    if (user !== null) {
      return <button className="google-sign-in-button" onClick={() => dispatch(signOut())}>
        <img src={user.photoURL ?? avatar} alt="Google avatar"/>
        {user.displayName}
        <img className={'icon'} src={svgSignOut} alt={''}/>
      </button>;
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
