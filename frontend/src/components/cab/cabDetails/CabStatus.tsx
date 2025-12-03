import React from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CabStatusProps {
    isOnline: boolean;
    onToggle: (status: boolean) => void;
}

const CabStatus: React.FC<CabStatusProps> = ({ isOnline, onToggle }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => onToggle(true)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors",
                    isOnline
                        ? "bg-black text-white"
                        : "bg-transparent text-muted-foreground hover:bg-gray-100"
                )}
            >
                {t("button.online")}
                {isOnline && (
                    <div className="bg-white text-black rounded-full p-0.5">
                        <Check className="w-3 h-3" strokeWidth={4} />
                    </div>
                )}
            </button>
            <button
                onClick={() => onToggle(false)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors",
                    !isOnline
                        ? "bg-gray-200 text-gray-600"
                        : "bg-transparent text-muted-foreground hover:bg-gray-100"
                )}
            >
                {t("button.offline")}
                {!isOnline && (
                    <div className="bg-gray-500 text-white rounded-full p-0.5">
                        <X className="w-3 h-3" strokeWidth={4} />
                    </div>
                )}
            </button>
        </div>
    );
};

export default CabStatus;
