import type { ROLE } from "@/types/role";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import ForgetPasswordForm from "./ForgetPasswordForm";

type propType = {
    heading: string;
    imagePath: string;
    role: ROLE;
};

function ForgetPasswordPage({ imagePath, heading, role }: propType) {
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
                        {/* <LoginForm role={role} /> */}
                        <ForgetPasswordForm role={role}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgetPasswordPage;
