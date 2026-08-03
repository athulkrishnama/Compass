import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ReviewThankYouStepProps {
    onClose: () => void;
}

interface Confetti {
    id: number;
    x: number;
    color: string;
    delay: number;
    size: number;
    duration: number;
}

const CONFETTI_COLORS = [
    "#FF4136",
    "#FF851B",
    "#FFDC00",
    "#2ECC40",
    "#00BCD4",
    "#B10DC9",
    "#FF69B4",
];

export function ReviewThankYouStep({ onClose }: ReviewThankYouStepProps) {
    const { t } = useTranslation();
    const [confetti, setConfetti] = useState<Confetti[]>([]);

    useEffect(() => {
        const pieces = Array.from({ length: 24 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: CONFETTI_COLORS[
                Math.floor(Math.random() * CONFETTI_COLORS.length)
            ],
            delay: Math.random() * 0.5,
            size: 6 + Math.random() * 8,
            duration: 1.5 + Math.random() * 1.5,
        }));
        setConfetti(pieces);
    }, []);

    return (
        <motion.div
            className="flex flex-col h-full items-center justify-between text-center relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Confetti */}
            <div className="absolute inset-0 pointer-events-none">
                {confetti.map((piece) => (
                    <motion.div
                        key={piece.id}
                        className="absolute top-0 rounded-sm"
                        style={{
                            left: `${piece.x}%`,
                            width: piece.size,
                            height: piece.size * 0.5,
                            backgroundColor: piece.color,
                        }}
                        initial={{ y: -20, opacity: 1, rotate: 0 }}
                        animate={{
                            y: 500,
                            opacity: [1, 1, 0],
                            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                        }}
                        transition={{
                            duration: piece.duration,
                            delay: piece.delay,
                            ease: "easeIn",
                        }}
                    />
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-6 relative z-10">
                <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                    }}
                    className="w-24 h-24 bg-black rounded-full flex items-center justify-center"
                >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-4xl font-black text-black mb-2">
                        {t(translationKey.hotelReviewModal.thankYouTitle)}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        {t(translationKey.hotelReviewModal.thankYouLine1)}
                        <br />
                        {t(translationKey.hotelReviewModal.thankYouLine2)}
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="w-full relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Button
                    onClick={onClose}
                    className="w-full h-12 rounded-2xl bg-black text-white font-bold hover:bg-black/90 flex items-center justify-center gap-2"
                >
                    {t(translationKey.hotelReviewModal.done)}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </motion.div>
        </motion.div>
    );
}
