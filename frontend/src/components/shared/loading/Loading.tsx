import React from "react";
import { motion } from "framer-motion";
import logo from "@/assets/images/logo.png";

const Loading: React.FC = () => {
    return (
        <div className="flex h-full w-full items-center justify-center bg-background/50 backdrop-blur-sm">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="relative flex items-center justify-center"
            >
                <img src={logo} alt="Loading..." className="h-24 w-auto" />
            </motion.div>
        </div>
    );
};

export default Loading;
