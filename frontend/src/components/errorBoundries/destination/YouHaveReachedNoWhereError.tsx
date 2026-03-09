import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";
import { Link } from "@tanstack/react-router";

function YouHaveReachedNoWhereError() {
    const { t } = useTranslation();

    return (
        <div className="  dark:bg-background-dark font-display relative flex flex-col selection:bg-ink-black selection:text-white overflow-hidden">
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center w-full px-6 lg:px-20 -mt-10 lg:mt-0 relative z-10 max-w-7xl mx-auto gap-12 lg:gap-24">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-1/2 flex justify-center lg:justify-end"
                >
                    <div className="relative w-full max-w-[00px] md:max-w-[800px] aspect-[4/5] mx-auto lg:mx-0">
                        <svg
                            viewBox="0 0 400 500"
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <path
                                d="M 330 180 L 350 160 M 340 190 L 360 170"
                                className="thick-stroke dark:stroke-white dark:fill-transparent"
                            />
                            <text
                                x="240"
                                y="185"
                                className="font-bold text-3xl fill-black dark:fill-white"
                            >
                                4
                            </text>

                            <path
                                d="M 120 160 L 220 175 L 220 310 L 120 320 Z"
                                fill="white"
                                className="thick-stroke dark:stroke-white dark:fill-background-dark"
                            />
                            <path
                                d="M 120 160 L 120 320"
                                className="thick-stroke dark:stroke-white dark:fill-transparent"
                            />

                            <path
                                d="M 112 250 L 112 320 L 135 320 L 135 250 Z"
                                className="thick-stroke fill-white dark:fill-background-dark dark:stroke-white"
                            />

                            <circle
                                cx="125"
                                cy="254"
                                r="20"
                                className="thick-stroke fill-white dark:fill-background-dark dark:stroke-white"
                            />
                            <path
                                d="M 115 260 Q 125 250 135 260"
                                className="thick-stroke dark:stroke-white dark:fill-transparent"
                            />
                            <circle
                                cx="135"
                                cy="240"
                                r="2"
                                className="fill-black dark:fill-white"
                            />

                            <path
                                d="M 160 260 L 210 250 L 220 295 L 170 305 Z"
                                className="thick-stroke fill-white dark:fill-background-dark dark:stroke-white shadow-sm"
                            />

                            <g transform="rotate(-11 190 275)">
                                <text
                                    x="175"
                                    y="278"
                                    className="font-black text-2xl fill-black dark:fill-white nerko-one"
                                >
                                    NOPE
                                </text>
                                <path
                                    d="M 175 285 L 205 285"
                                    strokeWidth="2"
                                    strokeDasharray="4 2"
                                    className="thick-stroke dark:stroke-white dark:fill-transparent"
                                />
                            </g>
                        </svg>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left z-20"
                >
                    <h1 className="text-6xl md:text-[5.5rem] lg:text-[7rem] font-bold leading-[1] tracking-tighter text-ink-black dark:text-white mb-6">
                        {t(translationKey.errorBoundary.reached)} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-black flex-inline to-slate-400 dark:from-white dark:to-slate-600 pb-2">
                            {t(translationKey.errorBoundary.nowhere)}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-md mb-10 leading-relaxed font-medium">
                        {t(translationKey.errorBoundary.nowhereDescription)}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-ink-black text-white dark:bg-white dark:text-ink-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 w-full sm:w-auto transition-all shadow-md outline-none focus:ring-4 focus:ring-ink-black/20"
                            onClick={() => window.history.back()}
                        >
                            <Link to={"/traveler/destinations"}>
                                {t(translationKey.errorBoundary.backToSafety)}
                            </Link>
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </main>

            <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-100/60 dark:bg-white/5 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
        </div>
    );
}

export default YouHaveReachedNoWhereError;
