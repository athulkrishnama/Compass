import { Button } from "@/components/ui/button";
import type { ROLE } from "@/types/role";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import LoginForm from "./LoginForm";
import { Link } from "@tanstack/react-router";
import { ROLES } from "@/constants/roles";

type propType = {
    role: ROLE;
    heading: string;
    imagePath: string;
};
function LoginPage({ role, heading, imagePath }: propType) {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="w-[1000px] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-100 p-10">
                    <h1 className="text-8xl nerko-one font-extrabold text-gray-800 mb-10 tracking-tight">
                        {t(translationKey.brand.name)}
                    </h1>
                    <img
                        src={imagePath}
                        alt="Brand illustration"
                        className="w-[85%] max-w-[400px] rounded-2xl object-contain drop-shadow-lg"
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
                    <h1 className="text-4xl font-semibold text-gray-800">
                        {heading}
                    </h1>

                    <div className="w-full max-w-sm">
                        <LoginForm role={role} />
                    </div>

                    {role !== ROLES.ADMIN && (
                        <div className="flex justify-between items-center w-full px-8">
                            <Link
                                className="text-gray-500 text-sm"
                                
                                to={
                                    role === ROLES.TRAVELER
                                        ? "/traveler/forgetPassword"
                                        : role === ROLES.HOTEL
                                          ? "/hotel/forgetPassword"
                                          : "/cab/forgetPassword"
                                }
                            >
                                <Button variant="link">
                                    {t(translationKey.text.forgetPassword) +
                                        " "}
                                </Button>
                            </Link>

                            <Link
                                to={
                                    role === ROLES.TRAVELER
                                        ? "/traveler/signup"
                                        : role === ROLES.HOTEL
                                          ? "/hotel/signup"
                                          : "/cab/signup"
                                }
                                replace
                            >
                                <Button variant="link">
                                    {" "}
                                    {t(translationKey.button.signup)}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
