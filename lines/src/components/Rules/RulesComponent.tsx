import React from "react";
import {useTranslation} from "react-i18next";

export const RulesComponent: React.FC = () => {
    const { t } = useTranslation();
    return(
        <div className={`rules`}>
            <h1>{t('rules')}</h1>
            <ul>
                {Array.from({length: 9}, (_, index) => {
                    return <li key={index}>{t(`rule${index}`)}</li>
                })}
            </ul>
        </div>
    )
}
