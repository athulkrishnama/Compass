import { useRef, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps {
    className?: string;
    fill?: string;
}

export function Spotlight({ className, fill }: SpotlightProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className={cn(
                "pointer-events-none absolute inset-0 z-10",
                className
            )}
        >
            <svg
                className="absolute h-[150%] w-[150%] -translate-x-[20%] -translate-y-[10%] opacity-50"
                viewBox="0 0 1024 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <radialGradient
                        id="spotlight-gradient"
                        cx="50%"
                        cy="50%"
                        r="50%"
                    >
                        <stop
                            offset="0%"
                            stopColor={fill || "white"}
                            stopOpacity="0.15"
                        />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
                <circle
                    cx="512"
                    cy="512"
                    r="512"
                    fill="url(#spotlight-gradient)"
                />
            </svg>
        </motion.div>
    );
}

interface CardSpotlightProps {
    children: React.ReactNode;
    className?: string;
    radius?: number;
}

export function CardSpotlight({
    children,
    className,
    radius = 350,
}: CardSpotlightProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    // const [isHovered, setIsHovered] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const { left, top } = divRef.current?.getBoundingClientRect() ?? {
                left: 0,
                top: 0,
            };
            mouseX.set(e.clientX - left);
            mouseY.set(e.clientY - top);
        },
        [mouseX, mouseY]
    );

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "group/spotlight relative overflow-hidden",
                className
            )}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
                style={{
                    background: useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, rgba(14,165,233,0.08), transparent 80%)`,
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

export function TextGenerateEffect({
    words,
    className,
}: {
    words: string;
    className?: string;
}) {
    const wordArray = words.split(" ");
    return (
        <motion.div className={cn("font-bold", className)}>
            {wordArray.map((word, idx) => (
                <motion.span
                    key={word + idx}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.5,
                        delay: idx * 0.08,
                        ease: "easeOut",
                    }}
                    className="inline-block mr-[0.3em]"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}

export function MovingBorder({
    children,
    className,
    containerClassName,
    borderClassName,
    duration = 3000,
}: {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
}) {
    return (
        <div
            className={cn(
                "relative p-[1px] overflow-hidden rounded-2xl group",
                containerClassName
            )}
        >
            <div
                className={cn("absolute inset-0 rounded-2xl", borderClassName)}
                style={{
                    background: `conic-gradient(from var(--border-angle, 0deg), transparent 60%, rgba(59,130,246,0.5) 80%, rgba(99,102,241,0.5) 90%, transparent 100%)`,
                    animation: `spin ${duration}ms linear infinite`,
                }}
            />
            <div className={cn("relative bg-white rounded-2xl", className)}>
                {children}
            </div>
        </div>
    );
}
