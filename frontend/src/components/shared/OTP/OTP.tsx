import React, { type ChangeEvent, type RefObject } from "react";

interface propType {
    count: number;
    handleComplete: (otp: string) => void;
    disabled: boolean;
    rootRef: RefObject<(HTMLInputElement | null)[]>;
}

function OTP({ count, handleComplete, disabled, rootRef }: propType) {
    const handleSubmit = () => {
        const index = rootRef.current.findIndex((ref) => {
            if (ref) {
                if (Number(ref.value) < 0 || Number(ref.value) > 9) return true;
            }
        });

        if (index !== -1) {
            rootRef.current[index]?.focus();
        }
        const otp = rootRef.current
            .map((ref) => (ref ? ref.value : ""))
            .join("");
        handleComplete(otp);
    };

    const onData = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let value = e?.target?.value;
        const index = Number(e.target.getAttribute("data-index"));

        if (+value > 9) {
            value = (+value % 10) + "";
            e.target.value = value;
        }

        if (index === rootRef.current.length - 1) {
            handleSubmit();
        } else if (value !== "" && +value >= 0) {
            rootRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.key === "Backspace") {
            if (e.target instanceof HTMLInputElement) {
                const index = Number(e.target.getAttribute("data-index"));
                e.target.value = "";
                rootRef.current[index - 1]?.focus();
            }
        }
    };
    return (
        <div className="flex items-center justify-center gap-3">
            {Array(count)
                .fill(null)
                .map((_, i) => (
                    <input
                        key={i}
                        onChange={onData}
                        onKeyUp={handleKeyDown}
                        data-index={i}
                        type="number"
                        disabled={disabled}
                        ref={(r) => {
                            rootRef.current[i] = r;
                        }}
                        className={`
          w-12 h-14 text-center text-2xl font-semibold
          border-2 border-gray-300 rounded-xl 
          focus:border-gray-800 focus:ring-2 focus:ring-gray-400
          outline-none transition-all duration-200 ease-in-out
          disabled:bg-gray-100 disabled:cursor-not-allowed
          caret-transparent relative
          focus:scale-105
        `}
                        style={{
                            animation: "blinkCaret 1s step-end infinite",
                        }}
                    />
                ))}
        </div>
    );
}

export default OTP;
