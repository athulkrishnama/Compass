import { motion, type Variants } from "framer-motion";
import { CardSpotlight } from "@/components/ui/spotlight";
import { Link } from "@tanstack/react-router";
import { Hotel, Car, MapPin, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

const k = translationKeys.landingPage;

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

function FeatureCards() {
    const { t } = useTranslation();

    const features = [
        {
            icon: Hotel,
            title: t(k.findHotels),
            description: t(k.findHotelsDesc),
            link: "/traveler/hotels",
            number: "01",
        },
        {
            icon: Car,
            title: t(k.bookCab),
            description: t(k.bookCabDesc),
            link: "/traveler/hotels",
            number: "02",
        },
        {
            icon: MapPin,
            title: t(k.exploreDestinations),
            description: t(k.exploreDestinationsDesc),
            link: "/traveler/destinations",
            number: "03",
        },
    ];

    return (
        <section className="py-24 bg-[#0a0a0a] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold text-white/30 tracking-[0.2em] uppercase">
                        {t(k.servicesLabel)}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
                        {t(k.servicesHeading)}
                    </h2>
                    <p className="text-white/40 mt-4 max-w-md mx-auto text-sm leading-relaxed">
                        {t(k.servicesSubheading)}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.number}
                            variants={itemVariants}
                        >
                            <CardSpotlight className="rounded-2xl">
                                <Link to={feature.link} className="block">
                                    <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.06] transition-all duration-500 group cursor-pointer h-full relative overflow-hidden">
                                        <span className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] select-none leading-none">
                                            {feature.number}
                                        </span>

                                        <div className="w-12 h-12 rounded-xl bg-white/[0.08] flex items-center justify-center mb-7 group-hover:bg-white/[0.12] group-hover:scale-110 transition-all duration-300">
                                            <feature.icon className="w-5 h-5 text-white/80" />
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                                            {feature.title}
                                        </h3>
                                        <p className="text-white/35 text-sm leading-relaxed mb-8">
                                            {feature.description}
                                        </p>

                                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-wider group-hover:text-white group-hover:gap-3 transition-all duration-300">
                                            {t(k.browse)}
                                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </div>
                                    </div>
                                </Link>
                            </CardSpotlight>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default FeatureCards;
