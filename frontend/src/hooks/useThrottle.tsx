import { useCallback, useRef } from "react";

// @ts-expect-error TS7019: Rest parameter 'args' implicitly has an 'any[]' type
function useThrottle<T extends (...args) => void>(fn: T, delay: number) {
    const throttling = useRef(false);

    const throttledFn = useCallback(
        (...args: Parameters<T>) => {
            if (!throttling.current) {
                fn(...args);
                throttling.current = true;

                setTimeout(() => {
                    throttling.current = false;
                }, delay);
            }
        },
        [fn, delay]
    );

    return throttledFn;
}

export default useThrottle;
