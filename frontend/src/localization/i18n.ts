import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './resources/en.ts';

export type LocalizationKeys = typeof en;

i18n.use(initReactI18next).init(
    {
        debug: import.meta.env.NODE_ENV === 'development',
        lng: 'en',
        supportedLngs: ['en'],
        interpolation: {
            escapeValue: true,
        },
        returnEmptyString: false,
        resources: {
            en: en satisfies LocalizationKeys,
        },
    },
    undefined
);

export default i18n;
