import LoginPage from "@/components/shared/Login/Login";
import { ROLES } from "@/constants/roles";
import image from "@/assets/images/loginImg1.svg";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

function Login() {
    const { t } = useTranslation();
    return (
        <LoginPage
            role={ROLES.TRAVELER}
            heading={t(translationKey.headings.login)}
            imagePath={image}
        />
    );
}

export default Login;
