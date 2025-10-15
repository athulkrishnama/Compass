import { useState } from "react";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import type { ROLE } from "@/types/role";
import { ROLES } from "@/constants/roles";
import { useNavigate } from "@tanstack/react-router";

type propType = {
    role: ROLE;
};
function ForgetPasswordForm({ role }: propType) {
    const [stage, setStage] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    function onCompleteStage1(e: string) {
        setEmail(e);
        setStage(2);
    }

    function onCompleteStage2(t: string) {
        setToken(t);
        setStage(3);
    }

    function onCompleteStage3() {
        if (role === ROLES.TRAVELER)
            navigate({ to: "/traveler/login", replace: true });
        else if (role === ROLES.CAB)
            navigate({ to: "/cab/login", replace: true });
        else navigate({ to: "/hotel/login", replace: true });
    }
    return (
        <div>
            {stage === 1 && <Stage1 onComplete={onCompleteStage1} />}
            {stage === 2 && (
                <Stage2 email={email} onComplete={onCompleteStage2} />
            )}
            {stage === 3 && (
                <Stage3
                    email={email}
                    token={token}
                    onComplete={onCompleteStage3}
                />
            )}
        </div>
    );
}

export default ForgetPasswordForm;
