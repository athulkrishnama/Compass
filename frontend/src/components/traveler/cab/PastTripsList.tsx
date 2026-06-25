import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PastTripCard, { type PastTrip } from "./PastTripCard";
import translationKey from "@/utils/i18n/translationKey";

interface PastTripsListProps {
    trips: PastTrip[];
    onSelect: (
        trip: PastTrip,
        pickupAddress: string,
        dropoffAddress: string
    ) => void;
}

const PastTripsList = ({ trips, onSelect }: PastTripsListProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
        >
            <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-3">
                {t(translationKey.cabHome.selectFromPastTrips)}
            </p>
            <div className="space-y-3">
                {trips.map((trip, i) => (
                    <PastTripCard
                        key={trip._id}
                        trip={trip}
                        index={i}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default PastTripsList;
