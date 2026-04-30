import { motion } from "framer-motion";
import CabOptionCard from "./CabOptionCard";
import type { ICalculateFareResponseDTO } from "@/types/api/responses/fareResponses";

interface CabOptionListProps {
    fares: ICalculateFareResponseDTO["fares"];
    selectedCab: string | null;
    onSelect: (cabType: string) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const CabOptionList = ({
    fares,
    selectedCab,
    onSelect,
}: CabOptionListProps) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto space-y-3 pb-24 md:pb-28 custom-scrollbar px-1 pt-1"
        >
            {fares.map((fare) => (
                <CabOptionCard
                    key={fare.cab_type}
                    fare={fare}
                    isSelected={selectedCab === fare.cab_type}
                    onSelect={onSelect}
                    variants={itemVariants}
                />
            ))}
        </motion.div>
    );
};

export default CabOptionList;
