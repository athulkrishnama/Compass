import image from "@/assets/images/loginImg4.svg";
import LoginPage from "@/components/shared/Login/Login";
import { ROLES } from "@/constants/roles";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
function Login() {
    const { t } = useTranslation();
    return (
        <LoginPage
            role={ROLES.ADMIN}
            heading={t(translationKey.headings.adminLogin)}
            imagePath={image}
        />
    );
}

export default Login;
