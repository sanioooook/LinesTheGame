import React, { ChangeEvent, FC } from 'react';
import './LanguageSelect.scss';
import {LanguagesEnum} from "../../types/languages.enum";
import {t} from "i18next";

interface LanguageSelectProps {
    languages: { value: number, label: string }[];
    selectedLanguage: number;
    onLanguageChange: (language: LanguagesEnum) => void;
}

const LanguageSelect: FC<LanguageSelectProps> = ({ languages, selectedLanguage, onLanguageChange }) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onLanguageChange(+event.target.value);
    };

    return (
        <div className="language-select-container">
            <label htmlFor="language-select" className="language-select-label">{t("selectLanguage")}</label>
            <select className={'language-select'} value={selectedLanguage} onChange={handleChange}>
                {languages.map((language) => (
                    <option key={language.value} value={language.value}>
                        {t(language.label)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelect;
