import SignupPage from "@/components/shared/Signup/Signup"
import { ROLES } from "@/constants/roles"
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next"
import image from '@/assets/images/signupimg3.svg'

function Signup() {
    const {t} = useTranslation();
  return (
    <SignupPage
        role={ROLES.HOTEL}
        heading={t(translationKey.headings.hotelSignup)}
        imagePath={image}
    />
  )
}

export default Signup
