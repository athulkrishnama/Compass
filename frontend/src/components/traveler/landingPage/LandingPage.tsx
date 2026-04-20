import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import HeroSection from "./HeroSection";
import FeatureCards from "./FeatureCards";
import DestinationsSection from "./DestinationsSection";
import HotelsSection from "./HotelsSection";
import WhyUsSection from "./WhyUsSection";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        const lenis = new Lenis({
            wrapper: container,
            content: content,
            lerp: 0.1,
            smoothWheel: true,
            duration: 1.5,
            touchMultiplier: 2,
        });

        lenis.on("scroll", ScrollTrigger.update);

        function raf(time: number) {
            lenis.raf(time * 1000);
        }

        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

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

        return () => {
            ctx.revert();
            gsap.ticker.remove(raf);
            lenis.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-screen overflow-y-auto overflow-x-hidden bg-black hide-scroll-bar"
        >
            <div ref={contentRef}>
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
        </div>
    );
}

export default LandingPage;
