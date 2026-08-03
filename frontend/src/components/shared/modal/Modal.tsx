import { useEffect, type PropsWithChildren } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface propType extends PropsWithChildren {
    handleClose: () => void;
    isOpen: boolean;
}
function Modal({ isOpen, children, handleClose }: propType) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClose]);
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleClose}
                    />

                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        onClick={handleClose}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg min-w-[25%] max-h-[80vh] rounded-2xl overflow-y-auto hide-scroll-bar shadow-2xl bg-white"
                        >
                            <div className="absolute inset-0 z-0">
                                <div className="w-full h-full bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl" />
                            </div>

                            <div className="relative z-10 p-6 flex flex-col gap-4">
                                <button
                                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition"
                                    onClick={() => handleClose()}
                                >
                                    <X className="w-5 h-5 text-red-500" />
                                </button>

                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Modal;
