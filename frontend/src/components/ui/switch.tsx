import { cn } from "@/lib/utils";

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

function Switch({
    checked,
    onCheckedChange,
    disabled = false,
    className,
}: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onCheckedChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                checked ? "bg-gray-900" : "bg-gray-200",
                disabled && "cursor-not-allowed opacity-50",
                className
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200",
                    checked ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    );
}

export { Switch };
