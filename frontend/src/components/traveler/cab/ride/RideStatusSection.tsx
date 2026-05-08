import { RIDE_STATUSES, type RideStatus } from "@/types/rideStatus";
import SearchingDriver from "./SearchingDriver";

interface RideStatusSectionProps {
    status: RideStatus;
}

const RideStatusSection = ({ status }: RideStatusSectionProps) => {
    switch (status) {
        case RIDE_STATUSES.SEARCHING:
            return <SearchingDriver />;
        default:
            return null;
    }
};

export default RideStatusSection;
