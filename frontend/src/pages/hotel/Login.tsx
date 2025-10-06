import LoginPage from "@/components/shared/Login/Login";
import { useTranslation } from "react-i18next";
import image from "@/assets/images/loginImg2.svg";
import { ROLES } from "@/constants/roles";
import translationKey from "@/utils/i18n/translationKey";

function Login() {
    const { t } = useTranslation();
    return (
        <LoginPage
            role={ROLES.HOTEL}
            heading={t(translationKey.headings.hotelLogin)}
            imagePath={image}
        />
    );
}

export default Login;
