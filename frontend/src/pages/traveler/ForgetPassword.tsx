import ForgetPasswordPage from "@/components/shared/forgetPassword/ForgetPassword";
import { ROLES } from "@/constants/roles";
import { useTranslation } from "react-i18next";
import image from "@/assets/images/forgetPasswordImg.svg";
import translationKey from "@/utils/i18n/translationKey";

function ForgetPassword() {
    const { t } = useTranslation();
    return (
        <ForgetPasswordPage
            role={ROLES.TRAVELER}
            imagePath={image}
            heading={t(translationKey.headings.forgetPassword)}
        />
    );
}

export default ForgetPassword;
