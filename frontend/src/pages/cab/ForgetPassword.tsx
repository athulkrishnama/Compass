import ForgetPasswordPage from "@/components/shared/forgetPassword/ForgetPassword";
import { ROLES } from "@/constants/roles";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import image from "@/assets/images/forgotPasswordImg3.svg";

function ForgetPassword() {
    const { t } = useTranslation();
    return (
        <ForgetPasswordPage
            heading={t(translationKey.headings.hotelForgetPassword)}
            role={ROLES.HOTEL}
            imagePath={image}
        />
    );
}

export default ForgetPassword;
