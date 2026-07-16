import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./es.json";
import en from "./en.json";
import reservaUxEs from "./reservaUx.es.json";
import reservaUxEn from "./reservaUx.en.json";
import performanceUxEs from "./performanceUx.es.json";
import performanceUxEn from "./performanceUx.en.json";

const traduccionEs = {
  ...es,
  reservar: { ...es.reservar, ...reservaUxEs.reservar },
  confirmacion: { ...es.confirmacion, ...reservaUxEs.confirmacion },
  galeria: { ...es.galeria, ...performanceUxEs.galeria },
};

const traduccionEn = {
  ...en,
  reservar: { ...en.reservar, ...reservaUxEn.reservar },
  confirmacion: { ...en.confirmacion, ...reservaUxEn.confirmacion },
  galeria: { ...en.galeria, ...performanceUxEn.galeria },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: traduccionEs },
      en: { translation: traduccionEn },
    },
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    interpolation: { escapeValue: false },
  });

export default i18n;
