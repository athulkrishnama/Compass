import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spotlight, TextGenerateEffect } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Globe, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import logo from "@/assets/images/logo.png";
import gsap from "gsap";

const k = translationKeys.landingPage;

const heroSlides = [
    {
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
        altKey: k.heroSlide1Alt,
    },
    {
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80",
        altKey: k.heroSlide2Alt,
    },
    {
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80",
        altKey: k.heroSlide3Alt,
    },
    {
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
        altKey: k.heroSlide4Alt,
    },
];

function HeroSection() {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const statsRef = useRef<HTMLDivElement>(null);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide(
            (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
        );
    }, []);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    useEffect(() => {
        if (!statsRef.current) return;
        const counters = statsRef.current.querySelectorAll(".stat-number");
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute("data-target") || "0");
            gsap.fromTo(
                counter,
                { innerText: 0 },
                {
                    innerText: target,
                    duration: 2,
                    delay: 1.5,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    onUpdate: function () {
                        const val = Math.ceil(
                            gsap.getProperty(counter, "innerText") as number
                        );
                        counter.textContent =
                            val >= 1000
                                ? val.toLocaleString() + "+"
                                : val.toString() + "+";
                    },
                }
            );
        });
    }, []);

    return (
        <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 hero-parallax"
                >
                    <img
                        src={heroSlides[currentSlide].image}
                        alt={t(heroSlides[currentSlide].altKey)}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 z-10" />

            <Spotlight className="z-20" fill="rgba(255,255,255,0.03)" />

            <motion.nav
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="absolute top-0 left-0 right-0 z-40 px-6 lg:px-12 py-5"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img
                            src={logo}
                            alt={t(translationKeys.brand.name)}
                            className="h-8 w-8 object-contain brightness-0 invert"
                        />
                        <span className="text-xl font-bold text-white nerko-one tracking-wide">
                            {t(translationKeys.brand.name)}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                        <Link
                            to="/traveler/hotels"
                            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
                        >
                            {t(k.hotels)}
                        </Link>
                        <Link
                            to="/traveler/destinations"
                            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
                        >
                            {t(k.destinations)}
                        </Link>
                        <Link
                            to="/traveler/hotels"
                            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
                        >
                            {t(k.cabs)}
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/traveler/login">
                            <Button
                                variant="ghost"
                                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full text-sm"
                            >
                                {t(k.login)}
                            </Button>
                        </Link>
                        <Link to="/traveler/signup">
                            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-5 text-sm font-semibold">
                                {t(k.signup)}
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            <div className="relative z-30 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center pt-20">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-5"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium tracking-widest uppercase">
                            <Globe className="w-3.5 h-3.5" />
                            {t(k.gateway)}
                        </span>
                    </motion.div>

                    <TextGenerateEffect
                        words={t(k.heroHeadline)}
                        className="text-3xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="text-base sm:text-lg text-white/60 mb-10 max-w-lg leading-relaxed font-light"
                    >
                        {t(k.heroSubheadline)}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.6 }}
                        className="flex items-center gap-4"
                    >
                        <Link to="/traveler/hotels">
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-sm font-semibold shadow-2xl hover:shadow-white/10 transition-all duration-300 hover:scale-[1.02] gap-2"
                            >
                                {t(k.exploreNow)}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link to="/traveler/destinations">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/20  hover:bg-white/10 hover:text-white rounded-full px-8 py-6 text-sm font-semibold backdrop-blur-sm transition-all duration-300"
                            >
                                {t(k.viewDestinations)}
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    ref={statsRef}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.7 }}
                    className="mt-12 sm:mt-16 flex flex-wrap items-center gap-x-8 gap-y-6 sm:gap-12 border-t border-white/10 pt-8"
                >
                    <div className="min-w-[100px]">
                        <div
                            className="stat-number text-2xl sm:text-3xl font-bold text-white tabular-nums"
                            data-target="10"
                        >
                            0+
                        </div>
                        <p className="text-[10px] sm:text-xs text-white/40 mt-1 uppercase tracking-wider">
                            {t(k.yearsExperience)}
                        </p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-white/10" />
                    <div className="min-w-[100px]">
                        <div
                            className="stat-number text-2xl sm:text-3xl font-bold text-white tabular-nums"
                            data-target="5000"
                        >
                            0+
                        </div>
                        <p className="text-[10px] sm:text-xs text-white/40 mt-1 uppercase tracking-wider">
                            {t(k.satisfiedClients)}
                        </p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-white/10" />
                    <div className="min-w-[100px]">
                        <div
                            className="stat-number text-2xl sm:text-3xl font-bold text-white tabular-nums"
                            data-target="100"
                        >
                            0+
                        </div>
                        <p className="text-[10px] sm:text-xs text-white/40 mt-1 uppercase tracking-wider">
                            {t(k.destinations)}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-10 right-10 z-30 flex items-center gap-3">
                <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-all duration-200"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                    {heroSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`transition-all duration-300 rounded-full ${
                                idx === currentSlide
                                    ? "w-8 h-1.5 bg-white"
                                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-all duration-200"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}

export default HeroSection;
