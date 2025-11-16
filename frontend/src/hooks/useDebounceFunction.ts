import { useRef } from "react";

export function useDebounceFunction<T extends (...args: any[]) => any>(
    cb: T,
    delay: number
) {
    const timeoutRef = useRef<number | null>(null);

    function debouncedFunction(...args: Parameters<T>) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            cb(args);
        }, delay);
    }

    return debouncedFunction;
}
