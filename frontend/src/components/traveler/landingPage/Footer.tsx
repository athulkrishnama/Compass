import { Link } from "@tanstack/react-router";
import logo from "@/assets/images/logo.png";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    MapPin,
    Mail,
    Phone,
    ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

const k = translationKeys.landingPage;

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

function Footer() {
    const { t } = useTranslation();

    const footerLinks = {
        company: [
            { name: t(k.about), href: "#" },
            { name: t(k.careers), href: "#" },
            { name: t(k.press), href: "#" },
        ],
        explore: [
            { name: t(k.hotels), href: "/traveler/hotels" },
            { name: t(k.destinations), href: "/traveler/destinations" },
            { name: t(k.cabs), href: "#" },
        ],
        support: [
            { name: t(k.helpCenter), href: "#" },
            { name: t(k.contact), href: "#" },
            { name: t(k.privacyPolicy), href: "#" },
        ],
    };

    return (
        <footer className="bg-black text-white">
            <div className="border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/[0.03] rounded-2xl p-10 border border-white/[0.06]">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
                                {t(k.footerCta)}
                            </h3>
                            <p className="text-white/35 max-w-md text-sm">
                                {t(k.footerCtaDesc)}
                            </p>
                        </div>
                        <Link
                            to="/traveler/signup"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] shadow-xl whitespace-nowrap"
                        >
                            {t(k.getStartedFree)}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2.5 mb-5">
                            <img
                                src={logo}
                                alt={t(translationKeys.brand.name)}
                                className="h-8 w-8 object-contain brightness-0 invert"
                            />
                            <span className="text-xl font-bold nerko-one tracking-wide">
                                {t(translationKeys.brand.name)}
                            </span>
                        </div>
                        <p className="text-white/30 text-sm leading-relaxed mb-6 max-w-sm">
                            {t(k.footerBrandDesc)}
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-white/30">
                                <MapPin className="w-3.5 h-3.5 text-white/20 shrink-0" />
                                {t(k.address)}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/30">
                                <Mail className="w-3.5 h-3.5 text-white/20 shrink-0" />
                                hello@compass.travel
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/30">
                                <Phone className="w-3.5 h-3.5 text-white/20 shrink-0" />
                                +91 98765 43210
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-5">
                            {t(k.company)}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-white/30 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-5">
                            {t(k.explore)}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-white/30 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-5">
                            {t(k.support)}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-white/30 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white/20">
                            {t(k.allRightsReserved, {
                                year: new Date().getFullYear(),
                            })}
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-white/25 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                                >
                                    <social.icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
