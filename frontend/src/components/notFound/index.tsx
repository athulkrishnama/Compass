import { lazy, Suspense } from "react";
import Loading from "@/components/shared/loading/Loading";

const CheckedOutEarlyNotFound = lazy(() => import("./CheckedOutEarlyNotFound"));
const WrongTurnNotFound = lazy(() => import("./WrongTurnNotFound"));

export default function NotFoundComponent() {
    const Component =
        Math.random() > 0.5 ? CheckedOutEarlyNotFound : WrongTurnNotFound;

    return (
        <Suspense
            fallback={
                <div className="min-h-[80vh] flex items-center justify-center">
                    <Loading />
                </div>
            }
        >
            <Component />
        </Suspense>
    );
}
