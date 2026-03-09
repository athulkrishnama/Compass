import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import translationKey from "@/utils/i18n/translationKey";

export default function WrongTurnNotFound() {
    const { t } = useTranslation();

    return (
        <div className="bg-background-light min-h-[80vh] flex flex-col font-display text-gray-900 transition-colors duration-300 relative overflow-hidden">
            <style>{`
                .huge-404 {
                    font-size: clamp(12rem, 35vw, 45rem);
                    line-height: 0.8;
                    opacity: 0.04;
                    pointer-events: none;
                    color: #000;
                }
                .line-art-svg {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: dash 5s linear forwards;
                }
                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>

            <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center select-none overflow-hidden z-0"
            >
                <motion.h1
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.04 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="huge-404 font-black whitespace-nowrap tracking-tighter transform rotate-2"
                >
                    404
                </motion.h1>
            </div>

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-7xl mx-auto py-12">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12 border border-black/5">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2 relative flex items-center justify-center"
                    >
                        <div className="relative w-full aspect-square max-w-[320px]">
                            <svg
                                className="w-full h-full text-black line-art-svg"
                                viewBox="0 0 200 200"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="160"
                                    cy="40"
                                    fill="none"
                                    r="15"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <g
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                >
                                    <path d="M100 130 L100 90 C100 80 110 70 120 70 L80 70 C90 70 100 80 100 90" />
                                    <path d="M100 130 L85 170" />
                                    <path d="M100 130 L115 170" />
                                    <circle cx="100" cy="60" r="12" />
                                    <path
                                        d="M90 80 L110 80 M95 90 L105 90 M90 100 L110 100"
                                        opacity="0.5"
                                    />
                                    <rect
                                        height="30"
                                        rx="2"
                                        width="40"
                                        x="120"
                                        y="80"
                                    />
                                    <path d="M130 80 L130 110 M150 80 L150 110" />
                                    <path d="M120 90 L160 90 M120 100 L160 100" />
                                    <path d="M70 50 C70 45 75 40 80 40 C85 40 85 45 80 50 L80 55 M80 60 L80 62" />
                                    <path d="M50 70 C50 65 55 60 60 60 C65 60 65 65 60 70 L60 75 M60 80 L60 82" />
                                </g>
                                <g
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    transform="translate(20, 100) scale(0.8)"
                                >
                                    <path
                                        d="M40 80 Q50 40 40 0"
                                        strokeWidth="3"
                                    />
                                    <path d="M40 0 Q10 10 0 30" />
                                    <path d="M40 0 Q70 10 80 30" />
                                    <path d="M40 0 Q20 -20 0 -10" />
                                    <path d="M40 0 Q60 -20 80 -10" />
                                </g>
                                <path
                                    d="M20 170 L180 170"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                />
                                <g
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    transform="translate(150, 155) scale(0.5)"
                                >
                                    <path d="M5 20 L5 10 L15 0 L35 0 L45 10 L45 20 Z" />
                                    <circle cx="12" cy="20" r="5" />
                                    <circle cx="38" cy="20" r="5" />
                                    <path
                                        d="M50 10 L60 10"
                                        strokeDasharray="2 2"
                                    />
                                </g>
                            </svg>
                            <div className="absolute bottom-10 left-10 bg-black text-white px-2 py-1 text-xs font-bold rounded rotate-[-10deg]">
                                404
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full md:w-1/2 space-y-6 text-left"
                    >
                        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black leading-none">
                            {t(translationKey.notFound.title)}
                        </h2>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            {t(translationKey.notFound.subtitle)}
                        </h3>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            {t(translationKey.notFound.description)}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                            <Link
                                to="/"
                                className="w-full sm:w-auto px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                <span>
                                    {t(translationKey.notFound.bookRealTrip)}
                                </span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
