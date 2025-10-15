import LoginPage from "@/components/shared/Login/Login";
import image from "@/assets/images/loginImg3.svg";
import { ROLES } from "@/constants/roles";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
function Login() {
    const { t } = useTranslation();
    return (
        <LoginPage
            role={ROLES.CAB}
            heading={t(translationKey.headings.cabLogin)}
            imagePath={image}
        />
    );
}

export default Login;
