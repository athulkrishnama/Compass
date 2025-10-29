import { useCallback, useRef } from "react";

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
