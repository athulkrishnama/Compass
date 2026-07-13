import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import translationKey from "@/utils/i18n/translationKey";
import { calculateFare } from "@/services/api/fareApiService";
import { createRideMutationOptions } from "@/queryOptions/rideQueryOptions";
import type { IRideDetailsResponseDTO } from "@/types/api/responses/rideResponses";

interface RideTimeoutRetryProps {
    ride: IRideDetailsResponseDTO;
}

const RideTimeoutRetry = ({ ride }: RideTimeoutRetryProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isRetrying, setIsRetrying] = useState(false);
    const { mutate: createRide } = useMutation(createRideMutationOptions());

    const handleRetryRide = async () => {
        if (!ride || isRetrying) return;
        setIsRetrying(true);
        try {
            const fareResponse = await calculateFare({
                pickup: ride.pickup_point,
                dropoff: ride.dropoff_point,
            });

            const fareData = fareResponse.data;
            if (!fareData) throw new Error("Failed to get fare");

            const vehicleType = ride.selected_fare?.cab_type;
            const matchingFare = fareData.fares.find(
                (f) => f.cab_type === vehicleType
            );

            if (!matchingFare) {
                toast.error("Selected vehicle type is unavailable", {
                    description:
                        "Please try searching again from the home screen.",
                });
                setIsRetrying(false);
                return;
            }

            createRide(
                { fareId: fareData.id, vehicleType },
                {
                    onSuccess: (response) => {
                        if (!response.data?.rideId) return;
                        toast.success("Searching for drivers again!");
                        navigate({
                            to: `/traveler/cab/ride/${response.data.rideId}`,
                        });
                    },
                    onError: (error) => {
                        toast.error(error.message || "Failed to retry ride");
                    },
                    onSettled: () => {
                        setIsRetrying(false);
                    },
                }
            );
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to retry ride"
            );
            setIsRetrying(false);
        }
    };

    return (
        <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-neutral-900">
                        {t(translationKey.rideDetails.noDriversFound)}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {t(translationKey.rideDetails.noDriversFoundDesc)}
                    </p>
                </div>
            </div>
            <button
                onClick={handleRetryRide}
                disabled={isRetrying}
                className="w-full py-2.5 px-4 rounded-lg bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <RefreshCw
                    className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
                />
                {isRetrying
                    ? t(translationKey.rideDetails.searchingRetry)
                    : t(translationKey.rideDetails.tryAgain)}
            </button>
        </div>
    );
};

export default RideTimeoutRetry;
