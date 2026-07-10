import { motion } from "framer-motion";
import { Outlet } from "@tanstack/react-router";

function ProfileLayout() {
    return (
        <div className="min-h-full w-full bg-gray-50 flex items-start sm:items-center justify-center p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex bg-white rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden w-full max-w-3xl min-h-[60vh]"
            >
                <div className="flex-1 flex justify-center p-4 sm:p-8 overflow-y-auto hide-scroll-bar">
                    <Outlet />
                </div>
            </motion.div>
        </div>
    );
}

export default ProfileLayout;
