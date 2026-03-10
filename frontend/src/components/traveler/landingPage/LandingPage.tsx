import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "./HeroSection";
import FeatureCards from "./FeatureCards";
import DestinationsSection from "./DestinationsSection";
import HotelsSection from "./HotelsSection";
import WhyUsSection from "./WhyUsSection";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx = gsap.context(() => {
            gsap.utils
                .toArray<HTMLElement>(".landing-section")
                .forEach((section) => {
                    gsap.fromTo(
                        section,
                        { opacity: 0, y: 60 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: section,
                                scroller: container,
                                start: "top 85%",
                                end: "top 20%",
                                toggleActions: "play none none reverse",
                            },
                        }
                    );
                });
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-screen overflow-y-auto overflow-x-hidden bg-black hide-scroll-bar"
        >
            <HeroSection />
            <div className="landing-section">
                <FeatureCards />
            </div>
            <div className="landing-section">
                <DestinationsSection />
            </div>
            <div className="landing-section">
                <HotelsSection />
            </div>
            <div className="landing-section">
                <WhyUsSection />
            </div>
            <div className="landing-section">
                <Footer />
            </div>
        </div>
    );
}

export default LandingPage;
