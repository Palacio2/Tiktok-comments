import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import uk from './uk.json';
import en from './en.json';
import pl from './pl.json';
import fr from './fr.json';
import ru from './ru.json';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      uk: { translation: uk },
      en: { translation: en },
      pl: { translation: pl },
      fr: { translation: fr },
      ru: { translation: ru },
    },
    lng: 'en', // Мова за замовчуванням
    fallbackLng: 'en', // Резервна мова
    interpolation: {
      escapeValue: false, // React вже захищає від XSS
    },
  });

export default i18n;