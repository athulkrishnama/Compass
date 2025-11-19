import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { join } from "path";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: join(process.cwd(), "src/locales", "{{lng}}", "{{ns}}.json"),
    },
    detection: {
      order: ["header"],
    },
    fallbackLng: "en",
  });
