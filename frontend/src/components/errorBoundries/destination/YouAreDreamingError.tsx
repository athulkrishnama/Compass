import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Ghost, BedDouble, Car, Map as MapIcon } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";

function YouAreDreamingError() {
    const { t } = useTranslation();

    return (
        <main className="flex-grow flex items-center justify-center relative p-6 min-h-[80vh] font-display text-black dark:text-white  dark:bg-background-dark overflow-hidden selection:bg-black selection:text-white">
            <style>{`
                :root {
                    --perspective: 1000px;
                }
                .dream-container {
                    perspective: var(--perspective);
                }
                .dream-panel {
                    transform-style: preserve-3d;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .panel-1 { transform: translateZ(0px) rotateX(10deg); }
                .panel-2 { transform: translateZ(-100px) rotateX(10deg) translateY(-20px); }
                .panel-3 { transform: translateZ(-200px) rotateX(10deg) translateY(-40px); }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 dream-container flex items-center justify-center pointer-events-none"
            >
                <div className="absolute w-[60vw] h-[45vh] max-w-3xl border border-black/10 dark:border-white/10 rounded-2xl panel-3 bg-gray-50/30 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                    <div className="relative w-32 h-48 border-[3px] border-black dark:border-white flex flex-col items-center justify-end pb-6">
                        <div className="absolute inset-0  dark:bg-neutral-800 opacity-20"></div>
                        <Ghost className="w-12 h-12 mb-3" strokeWidth={1} />
                        <p className="text-[9px] uppercase tracking-tighter text-center px-1">
                            {t(translationKey.errorBoundary.room404)}
                        </p>
                    </div>
                </div>

                <div className="absolute w-[55vw] h-[40vh] max-w-2xl border border-black/20 dark:border-white/20 rounded-2xl panel-2 bg-gray-100/40 dark:bg-white/5 backdrop-blur-md flex items-center justify-between px-16">
                    <div className="w-36 h-12 border-2 border-black dark:border-white flex items-center justify-center relative -rotate-90 md:translate-y-[-50px]">
                        <span className="font-bold text-lg tracking-tighter">
                            {t(translationKey.errorBoundary.taxi)}
                        </span>
                        <div className="absolute -top-3 w-3 h-3 bg-black dark:bg-white"></div>
                    </div>
                    <div className="w-16 h-16 border-2 border-dashed border-black/40 dark:border-white/40 rounded-full animate-spin-slow"></div>
                </div>

                <div className="absolute w-[50vw] h-[35vh] max-w-xl border-2 border-black dark:border-white rounded-2xl panel-1 bg-white/80 dark:bg-black/60 backdrop-blur-xl shadow-2xl"></div>
            </motion.div>

            <div className="relative z-40 text-center max-w-2xl px-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 inline-block border border-black dark:border-white px-3 py-1"
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                        {t(translationKey.errorBoundary.errorSequence)}
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-6xl font-serif italic mb-6 leading-tight tracking-tight"
                >
                    {t(translationKey.errorBoundary.youAreNotDreaming)} <br />
                    <span className="not-italic font-display font-light text-3xl md:text-5xl">
                        {t(translationKey.errorBoundary.thisPageIs)}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto mb-8 opacity-80"
                >
                    {t(translationKey.errorBoundary.dreamDescription)}
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link
                        to="/"
                        className="group relative px-8 py-3 bg-black dark:bg-white text-white dark:text-black overflow-hidden transition-all"
                    >
                        <span className="relative z-10 font-bold uppercase tracking-widest text-xs">
                            {t(translationKey.errorBoundary.wakeUp)}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.back();
                        }}
                        className="px-8 py-3 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-bold uppercase tracking-widest text-xs"
                    >
                        {t(translationKey.errorBoundary.nextLayer)}
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-12 flex justify-center gap-8 opacity-30 grayscale"
                >
                    <div className="flex flex-col items-center">
                        <BedDouble className="w-8 h-8 mb-2" strokeWidth={1.5} />
                        <span className="text-[9px] uppercase font-bold tracking-wider text-center">
                            {t(translationKey.errorBoundary.nonExistentSuite)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Car className="w-8 h-8 mb-2" strokeWidth={1.5} />
                        <span className="text-[9px] uppercase font-bold tracking-wider text-center">
                            {t(translationKey.errorBoundary.ghostCab)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <MapIcon className="w-8 h-8 mb-2" strokeWidth={1.5} />
                        <span className="text-[9px] uppercase font-bold tracking-wider text-center">
                            {t(translationKey.errorBoundary.unchartedTerritory)}
                        </span>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

export default YouAreDreamingError;
