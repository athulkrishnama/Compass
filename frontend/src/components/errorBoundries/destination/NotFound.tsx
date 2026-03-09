import Loading from "@/components/shared/loading/Loading";
import { lazy, Suspense } from "react";
const YouAreDreamingError = lazy(
    () => import("@/components/errorBoundries/destination/YouAreDreamingError")
);
const YouHaveReachedNoWhereError = lazy(
    () =>
        import(
            "@/components/errorBoundries/destination/YouHaveReachedNoWhereError"
        )
);

export default function NotFound() {
    const ErrorComponent =
        Math.random() > 0.5 ? YouAreDreamingError : YouHaveReachedNoWhereError;
    return (
        <Suspense
            fallback={
                <div className="min-h-screen">
                    <Loading />
                </div>
            }
        >
            <ErrorComponent />
        </Suspense>
    );
}
