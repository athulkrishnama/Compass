import { useQuery } from "@tanstack/react-query";
import { getRideCabDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";
import { Star, Phone, ShieldCheck } from "lucide-react";

interface RideCabDetailsProps {
    rideId: string;
}

const RideCabDetails = ({ rideId }: RideCabDetailsProps) => {
    const { data: response, isLoading } = useQuery(
        getRideCabDetailsQueryOptions(rideId)
    );

    if (isLoading) {
        return (
            <div className="w-full bg-white rounded-3xl p-6 border border-neutral-200 flex items-center justify-center min-h-[200px] animate-pulse shrink-0">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-200 rounded-full"></div>
                    <div className="w-32 h-4 bg-neutral-200 rounded"></div>
                    <div className="w-48 h-3 bg-neutral-200 rounded mt-2"></div>
                </div>
            </div>
        );
    }

    if (!response?.data) return null;

    const { driver, cab } = response.data;

    return (
        <div className="w-full bg-white rounded-3xl p-5 md:p-6 border border-neutral-200 shrink-0">
            <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0">
                        <img
                            src={
                                driver.profile_image ||
                                "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(driver.full_name) +
                                    "&background=random"
                            }
                            alt={driver.full_name}
                            className="w-16 h-16 rounded-full object-cover border border-neutral-200"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-neutral-900 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                            <ShieldCheck className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-neutral-900 leading-tight flex flex-wrap items-center gap-2">
                            <span className="truncate">{driver.full_name}</span>
                            <span className="flex shrink-0 items-center text-xs font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
                                {cab.averageRating > 0
                                    ? cab.averageRating.toFixed(1)
                                    : "New"}{" "}
                                <Star className="w-3 h-3 ml-1 fill-current" />
                            </span>
                        </h3>
                        <p className="text-sm text-neutral-500 font-medium mt-1 truncate">
                            {cab.model} ({cab.type})
                        </p>
                    </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end shrink-0 gap-3">
                    <div className="bg-white text-neutral-900 font-bold px-3 py-1.5 rounded text-sm tracking-wider border border-neutral-300">
                        {cab.registrationNumber}
                    </div>
                    {driver.mobile && (
                        <a
                            href={`tel:${driver.mobile}`}
                            className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            {cab.images && cab.images.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {cab.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${cab.model} image ${index + 1}`}
                                className="h-20 w-32 object-cover rounded-xl shrink-0 border border-neutral-200"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RideCabDetails;
