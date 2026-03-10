import { motion, type Variants } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

const k = translationKeys.landingPage;

const destinations = [
    {
        nameKey: k.munnar,
        descKey: k.munnarDesc,
        image: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80",
        rotate: -6,
    },
    {
        nameKey: k.goa,
        descKey: k.goaDesc,
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        rotate: 4,
    },
    {
        nameKey: k.udaipur,
        descKey: k.udaipurDesc,
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
        rotate: -3,
    },
    {
        nameKey: k.manali,
        descKey: k.manaliDesc,
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
        rotate: 7,
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

function DestinationsSection() {
    const { t } = useTranslation();

    return (
        <section className="py-24 bg-[#111111] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold text-white/30 tracking-[0.2em] uppercase">
                        {t(k.discoverLabel)}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
                        {t(k.popularDestinations)}
                    </h2>
                    <p className="text-white/35 mt-3 max-w-md mx-auto text-sm leading-relaxed">
                        {t(k.popularDestinationsDesc)}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="flex justify-center items-center flex-wrap gap-2 md:gap-0"
                >
                    {destinations.map((dest) => (
                        <motion.div
                            key={dest.nameKey}
                            variants={cardVariants}
                            style={{ rotate: dest.rotate }}
                            whileHover={{
                                scale: 1.1,
                                rotate: 0,
                                zIndex: 100,
                            }}
                            whileTap={{
                                scale: 1.1,
                                rotate: 0,
                                zIndex: 100,
                            }}
                            className="rounded-xl -mr-2 md:-mr-4 mt-4 p-1.5 bg-white/[0.05] border border-white/[0.08] shrink-0 overflow-hidden cursor-pointer group transition-shadow duration-300 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.1)]"
                        >
                            <Link
                                to="/traveler/destinations"
                                className="block relative"
                            >
                                <img
                                    src={dest.image}
                                    alt={t(dest.nameKey)}
                                    className="rounded-lg h-40 w-40 md:h-64 md:w-64 object-cover shrink-0"
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <h3 className="text-base font-bold text-white mb-0.5">
                                        {t(dest.nameKey)}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                                        {t(k.explore)}
                                        <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-14 text-center">
                    <Link
                        to="/traveler/destinations"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/10 text-xs font-semibold text-white/70 uppercase tracking-wider hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                    >
                        {t(k.viewAllDestinations)}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default DestinationsSection;
