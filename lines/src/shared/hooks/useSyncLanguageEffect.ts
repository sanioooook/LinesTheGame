import {useEffect} from 'react';
import {useAppSelector} from '../../store/hooks';
import {LanguagesEnum} from '../../types/languages.enum';
import i18n from '../../i18n';

export const useSyncLanguageEffect = () => {
  const language = useAppSelector((state) => state.gameBoard.selectedLanguage);

  useEffect(() => {
    i18n.changeLanguage(LanguagesEnum[language]);
  }, [language]);
};
