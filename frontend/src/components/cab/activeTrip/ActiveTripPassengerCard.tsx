import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActiveTripPassengerCardProps {
    name: string;
    phone: string;
    avatarUrl?: string;
    onCall?: () => void;
    onMessage?: () => void;
}

export function ActiveTripPassengerCard({
    name,
    phone,
    avatarUrl,
    onCall,
}: ActiveTripPassengerCardProps) {
    const { t } = useTranslation();

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gray-50 rounded-2xl p-4"
        >
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-gray-200 shrink-0">
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback className="bg-gray-900 text-white text-sm font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base leading-tight truncate">
                        {name}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{phone}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onCall}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 active:scale-95 transition-all"
                >
                    <Phone className="w-4 h-4" />
                    {t(translationKey.activeTrip.call)}
                </button>
            </div>
        </motion.div>
    );
}
