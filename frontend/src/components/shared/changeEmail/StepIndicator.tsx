import { Check } from "lucide-react";
import type { ChangeEmailStep } from "../../../hooks/useChangeEmail";

interface StepIndicatorProps {
    currentStep: ChangeEmailStep;
}

const steps: ChangeEmailStep[] = ["requestOtp", "verifyOtp", "newEmail"];

function StepIndicator({ currentStep }: StepIndicatorProps) {
    const getStepIndex = (step: ChangeEmailStep) => steps.indexOf(step);
    const currentStepIndex = getStepIndex(currentStep);

    const isStepComplete = (stepIndex: number) => stepIndex < currentStepIndex;
    const isStepCurrent = (stepIndex: number) => stepIndex === currentStepIndex;

    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, index) => (
                <div
                    key={index}
                    className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
                >
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                            isStepCurrent(index)
                                ? "bg-zinc-950 text-white"
                                : isStepComplete(index)
                                  ? "bg-green-500 text-white"
                                  : "bg-zinc-200 text-zinc-400"
                        }`}
                    >
                        {isStepComplete(index) ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            index + 1
                        )}
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                                isStepComplete(index)
                                    ? "bg-green-500"
                                    : "bg-zinc-200"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default StepIndicator;
