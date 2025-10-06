import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "@/utils/i18n/locales/en.json";

const resources = {
    en: {
        translation: enLang,
    },
};
i18n.use(initReactI18next).init({
    resources,
    lng:"en",
    fallbackLng: "en",
});
