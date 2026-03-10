import { motion, type Variants } from "framer-motion";
import { Hotel, Car, Compass, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

const k = translationKeys.landingPage;

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

function WhyUsSection() {
    const { t } = useTranslation();

    const benefits = [
        {
            icon: Hotel,
            titleKey: k.easyHotelBooking,
            descKey: k.easyHotelBookingDesc,
        },
        {
            icon: Car,
            titleKey: k.quickCabServices,
            descKey: k.quickCabServicesDesc,
        },
        {
            icon: Compass,
            titleKey: k.curatedDestinations,
            descKey: k.curatedDestinationsDesc,
        },
        {
            icon: ShieldCheck,
            titleKey: k.securePlatform,
            descKey: k.securePlatformDesc,
        },
    ];

    return (
        <section className="py-24 bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold text-white/30 tracking-[0.2em] uppercase">
                        {t(k.benefitsLabel)}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
                        {t(k.whyUsHeading)}
                    </h2>
                    <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
                        {t(k.whyUsSubheading)}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {benefits.map((benefit) => (
                        <motion.div
                            key={benefit.titleKey}
                            variants={itemVariants}
                            className="group"
                        >
                            <div className="text-center p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:border-white/15">
                                <div className="w-14 h-14 rounded-xl bg-white/[0.08] flex items-center justify-center mx-auto mb-6 group-hover:bg-white/[0.12] group-hover:scale-110 transition-all duration-300">
                                    <benefit.icon className="w-6 h-6 text-white/80" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-3 tracking-tight">
                                    {t(benefit.titleKey)}
                                </h3>
                                <p className="text-xs text-white/35 leading-relaxed">
                                    {t(benefit.descKey)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default WhyUsSection;
