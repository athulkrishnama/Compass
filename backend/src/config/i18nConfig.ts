import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { join } from "path";
import { env } from "./envConfig";

const isProduction: boolean = env.NODE_ENV === "PRODUCTION";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: isProduction
        ? join(process.cwd(), "dist", "locales", "{{lng}}", "{{ns}}.json")
        : join(process.cwd(), "src", "locales", "{{lng}}", "{{ns}}.json"),
    },
    detection: {
      order: ["header"],
    },
    fallbackLng: "en",
  });

export default i18next;
