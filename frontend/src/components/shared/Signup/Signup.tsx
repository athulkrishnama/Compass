import type { ROLE } from "@/types/role";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import SignupForm from "./SignupForm";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ROLES } from "@/constants/roles";

type propType = {
    role: ROLE;
    heading: string;
    imagePath: string;
};
function SignupPage({ imagePath, role, heading }: propType) {
    const { t } = useTranslation();
    return (
        <div className="relative min-h-screen flex justify-center items-center bg-gray-50 md:p-8 overflow-hidden">
            <div
                className="absolute inset-0 md:hidden bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${imagePath})` }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 w-full max-w-[1000px] h-screen md:h-auto md:min-h-[600px] bg-transparent md:bg-white md:rounded-3xl md:shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:bg-gray-100 p-8 md:p-10 py-12 flex-1 md:flex-none">
                    <h1 className="text-6xl md:text-8xl nerko-one font-extrabold text-white md:text-gray-800 mb-2 md:mb-10 tracking-tight drop-shadow-lg md:drop-shadow-none">
                        {t(translationKey.brand.name)}
                    </h1>
                    <h2 className="md:hidden text-xl font-semibold text-white/90 mb-6 text-center drop-shadow-md tracking-wide">
                        {heading}
                    </h2>
                    <img
                        src={imagePath}
                        alt="Brand illustration"
                        className="hidden md:block w-[85%] max-w-[400px] rounded-2xl object-contain drop-shadow-lg"
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 sm:p-10 py-10 md:py-12 rounded-t-[2.5rem] md:rounded-none shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none min-h-[60vh] md:min-h-0">
                    <h1 className="hidden md:block text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-6">
                        {heading}
                    </h1>

                    <div className="w-full max-w-sm">
                        <SignupForm {...{ role, heading }} />
                    </div>

                    <p className="text-gray-500 text-sm mt-6">
                        {t(translationKey.text.alreadyHaveAccount) + " "}
                        <Link
                            to={
                                role === ROLES.TRAVELER
                                    ? "/traveler/login"
                                    : role === ROLES.CAB
                                      ? "/cab/login"
                                      : "/hotel/login"
                            }
                            replace
                        >
                            <Button variant="link">
                                {" "}
                                {t(translationKey.button.signin)}
                            </Button>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
