import SignupPage from "@/components/shared/Signup/Signup";
import { ROLES } from "@/constants/roles";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import Image from "@/assets/images/signupImg1.svg";

function Signup() {
    const { t } = useTranslation();
    return (
        <SignupPage
            role={ROLES.TRAVELER}
            heading={t(translationKey.headings.signup)}
            imagePath={Image}
        />
    );
}

export default Signup;
