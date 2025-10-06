import { type PropsWithChildren } from "react";
import { X } from "lucide-react";
import { AnimatePresence } from "motion/react";

interface propType extends PropsWithChildren {
    handleClose: () => void;
    isOpen: boolean;
}
function Modal({ isOpen, children, handleClose }: propType) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="absolute h-[100vh] w-[100vw]  top-0 left-0 flex items-center justify-center ">
                    {
                        <div className="min-w-1/4 min-h-1/4 shadow-2xl rounded-2xl bg-white">
                            <div className="w-full flex justify-end px-3">
                                <X color="red" onClick={handleClose} />
                            </div>
                            {children}
                        </div>
                    }
                </div>
            )}
        </AnimatePresence>
    );
}

export default Modal;
