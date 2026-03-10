import { motion, type Variants } from "framer-motion";
import { CardSpotlight } from "@/components/ui/spotlight";
import { Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

const k = translationKeys.landingPage;

const hotels = [
    {
        nameKey: k.grandPalace,
        locationKey: k.grandPalaceLocation,
        price: 4500,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        rating: 4.8,
    },
    {
        nameKey: k.cliffsideResort,
        locationKey: k.cliffsideResortLocation,
        price: 6200,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
        rating: 4.9,
    },
    {
        nameKey: k.oceanBreezeVilla,
        locationKey: k.oceanBreezeVillaLocation,
        price: 5800,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        rating: 4.7,
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
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

function HotelsSection() {
    const { t } = useTranslation();

    return (
        <section className="py-24 bg-[#0a0a0a] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="flex items-end justify-between mb-14"
                >
                    <div>
                        <span className="text-xs font-semibold text-white/30 tracking-[0.2em] uppercase">
                            {t(k.stayLabel)}
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
                            {t(k.featuredHotels)}
                        </h2>
                        <p className="text-white/35 mt-3 max-w-md text-sm leading-relaxed">
                            {t(k.featuredHotelsDesc)}
                        </p>
                    </div>
                    <Link
                        to="/traveler/hotels"
                        className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-xs font-semibold text-white/70 uppercase tracking-wider hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                    >
                        {t(k.viewAll)}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {hotels.map((hotel) => (
                        <motion.div key={hotel.nameKey} variants={cardVariants}>
                            <CardSpotlight className="rounded-2xl">
                                <div className="bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.05] transition-all duration-500 group">
                                    <div className="relative overflow-hidden aspect-[4/3]">
                                        <img
                                            src={hotel.image}
                                            alt={t(hotel.nameKey)}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-lg">
                                            {t(k.fromPerNight, {
                                                price: hotel.price.toLocaleString(),
                                            })}
                                        </div>
                                        <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                            <Star className="w-3 h-3 text-white fill-white" />
                                            <span className="text-xs font-semibold text-white">
                                                {hotel.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                                            {t(hotel.nameKey)}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mb-5">
                                            <MapPin className="w-3 h-3 text-white/25" />
                                            <span className="text-xs text-white/35">
                                                {t(hotel.locationKey)}
                                            </span>
                                        </div>
                                        <Link to="/traveler/hotels">
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-xl border-white/10 text-white/70 text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-black hover:border-white transition-all duration-300 h-10 bg-transparent"
                                            >
                                                {t(k.viewHotel)}
                                                <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardSpotlight>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="md:hidden mt-10 text-center">
                    <Link
                        to="/traveler/hotels"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-colors"
                    >
                        {t(k.viewAllHotels)}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default HotelsSection;
