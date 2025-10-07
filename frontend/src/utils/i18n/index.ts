import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "@/utils/i18n/locales/en.json";
import mlLang from "@/utils/i18n/locales/ml.json";
import hiLang from "@/utils/i18n/locales/hi.json";
import taLang from "@/utils/i18n/locales/ta.json"

const resources = {
    en: {
        translation: enLang,
    },
    ml: {
        translation: mlLang,
    },
    hi: {
        translation: hiLang,
    },
    ta: {
        translation: taLang,
    },
};
i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
});
