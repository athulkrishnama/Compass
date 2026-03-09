import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import translationKey from "@/utils/i18n/translationKey";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const CheckedOutEarlyNotFound: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col transition-colors duration-300">
            <main className="flex-grow flex items-center justify-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05] select-none">
                    <span className="text-[25vw] font-black tracking-tighter text-black dark:text-white leading-none">
                        404
                    </span>
                </div>

                <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
                    <div className="order-2 lg:order-1 flex justify-center lg:justify-end illustration-container relative overflow-hidden">
                        <div className="relative w-full max-w-md aspect-square">
                            <motion.div
                                className="absolute top-10 right-10 w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full opacity-50"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.5, 0.6, 0.5],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-200 to-transparent dark:from-gray-800 rounded-xl opacity-30" />

                            <motion.div
                                className="absolute top-[20%] right-[20%] z-20"
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <div className="w-24 h-16 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-soft rounded-lg flex items-center justify-center rotate-6 transform">
                                    <span className="font-serif italic text-black dark:text-black font-bold">
                                        {t(
                                            translationKey.notFound
                                                .checkedOutEarly.hotel
                                        )}
                                    </span>
                                </div>
                                <div className="w-1 h-12 bg-gray-300 dark:bg-gray-600 mx-auto -mt-2" />
                            </motion.div>

                            <motion.div
                                className="absolute bottom-[20%] left-[10%] w-64 z-30"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{
                                    duration: 1,
                                    delay: 0.5,
                                    type: "spring",
                                }}
                            >
                                <div className="w-32 h-14 bg-yellow-400 mx-auto rounded-t-xl relative border-4 border-b-0 border-black overflow-hidden">
                                    <div className="w-full h-full bg-white/20" />
                                </div>
                                <div className="w-64 h-20 bg-yellow-400 rounded-xl border-4 border-black relative shadow-lg flex items-center justify-center">
                                    <div className="bg-black/10 text-black/50 font-bold uppercase text-xs px-2 py-1 rounded tracking-widest">
                                        {t(
                                            translationKey.notFound
                                                .checkedOutEarly.taxi
                                        )}
                                    </div>
                                    <div className="absolute top-2 w-full h-2 flex justify-center gap-1 opacity-40">
                                        <div className="w-2 h-2 bg-black" />
                                        <div className="w-2 h-2 bg-transparent" />
                                        <div className="w-2 h-2 bg-black" />
                                        <div className="w-2 h-2 bg-transparent" />
                                        <div className="w-2 h-2 bg-black" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 left-8 w-10 h-10 bg-secondary dark:bg-gray-200 rounded-full border-4 border-black dark:border-gray-800" />
                                <div className="absolute -bottom-4 right-8 w-10 h-10 bg-secondary dark:bg-gray-200 rounded-full border-4 border-black dark:border-gray-800" />
                            </motion.div>

                            <motion.div
                                className="absolute bottom-[25%] -right-[10%] w-12 h-12 border-2 border-dashed border-gray-400 rounded-full opacity-60"
                                animate={{
                                    x: ["200%", "-500%"],
                                    rotate: [0, -360],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 text-center lg:text-left space-y-8">
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-black leading-[1.1]">
                                {t(
                                    translationKey.notFound.checkedOutEarly
                                        .title1
                                )}
                                <br />
                                {t(
                                    translationKey.notFound.checkedOutEarly
                                        .title2
                                )}
                            </h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto lg:mx-0 font-light leading-relaxed">
                                {t(
                                    translationKey.notFound.checkedOutEarly
                                        .description
                                )}
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <Button onClick={() => navigate({ to: "/" })}>
                                {t(
                                    translationKey.notFound.checkedOutEarly
                                        .bookRealTrip
                                )}
                                <ArrowRight className="ml-2 text-sm" />
                            </Button>
                            <Button
                                onClick={() => navigate({ to: "/" })}
                                variant={"outline"}
                            >
                                {t(
                                    translationKey.notFound.checkedOutEarly
                                        .goHome
                                )}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckedOutEarlyNotFound;
