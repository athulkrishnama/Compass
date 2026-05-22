import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { closeRideRequestPopup } from "@/store/slices/rideRequestPopupSlice";
import { useQuery } from "@tanstack/react-query";
import { getRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";
import { MapPin, X, Clock, DollarSign, Navigation } from "lucide-react";

export default function RideRequestPopup() {
    const dispatch = useDispatch();
    const { isOpen, rideId } = useSelector(
        (state: RootState) => state.rideRequestPopup
    );

    const { data, isLoading, isError } = useQuery({
        ...getRideDetailsQueryOptions(rideId ?? ""),
        enabled: isOpen && !!rideId,
    });

    const handleDecline = () => {
        dispatch(closeRideRequestPopup());
        // TODO: emit DRIVER_REJECT_RIDE via socketService
    };

    const handleAccept = () => {
        dispatch(closeRideRequestPopup());
        // TODO: emit DRIVER_ACCEPT_RIDE via socketService
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                            New Ride Request
                        </p>
                        <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                            Ride Details
                        </h2>
                    </div>
                    <button
                        onClick={handleDecline}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {isLoading && (
                    <div className="flex flex-col gap-3 px-5 pb-5">
                        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                        <div className="h-5 w-2/3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-5 w-1/2 bg-gray-100 rounded animate-pulse" />
                        <div className="h-12 bg-gray-100 rounded-2xl animate-pulse mt-2" />
                    </div>
                )}

                {isError && (
                    <div className="px-5 pb-5 text-center text-red-500 text-sm">
                        Failed to load ride details.
                    </div>
                )}

                {data && !isLoading && (
                    <>
                        {/* Route Map placeholder */}
                        <div className="mx-5 mb-4 rounded-2xl bg-gray-100 h-28 flex items-center justify-center overflow-hidden relative">
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-3 h-3 rounded-full border-2 border-gray-500 bg-white" />
                                <div className="flex-1 border-t-2 border-dashed border-gray-400 w-24" />
                                <div className="w-3 h-3 rounded-sm bg-gray-600" />
                            </div>
                            <span className="absolute bottom-2 right-3 text-[10px] bg-white rounded-full px-2 py-0.5 shadow text-gray-500 font-medium">
                                Light Traffic
                            </span>
                        </div>

                        {/* Pickup & Dropoff */}
                        <div className="px-5 space-y-3 mb-4">
                            <div className="flex gap-3 items-start">
                                <span className="mt-1 w-2 h-2 rounded-full bg-gray-800 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                                        Pickup
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {data.data?.pickup_point?.latitude?.toFixed(5)},{" "}
                                        {data.data?.pickup_point?.longitude?.toFixed(5)}
                                    </p>
                                </div>
                            </div>

                            <div className="ml-1 w-px h-4 bg-gray-200" />

                            <div className="flex gap-3 items-start">
                                <span className="mt-1 w-2 h-2 rounded-sm bg-gray-800 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                                        Dropoff
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {data?.data?.dropoff_point?.latitude?.toFixed(5)},{" "}
                                        {data?.data?.dropoff_point?.longitude?.toFixed(5)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mx-5 mb-5 grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-2xl p-3">
                                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium uppercase tracking-wide">
                                        Est. Time
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.round(data?.data?.time / 60)}
                                    <span className="text-sm font-medium text-gray-500 ml-1">
                                        min
                                    </span>
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-3">
                                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                                    <DollarSign className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium uppercase tracking-wide">
                                        Earnings
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{data.data.selected_fare.fare}
                                </p>
                            </div>
                        </div>

                        {/* Distance */}
                        <div className="mx-5 mb-5 flex items-center gap-2 text-xs text-gray-400">
                            <Navigation className="w-3.5 h-3.5" />
                            <span>{(data.data.distance / 1000).toFixed(1)} km away</span>
                        </div>

                        {/* Actions */}
                        <div className="px-5 pb-7 grid grid-cols-2 gap-3">
                            <button
                                onClick={handleDecline}
                                className="py-3.5 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 active:scale-95 transition-all"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-700 active:scale-95 transition-all"
                            >
                                Accept Ride
                                <span className="text-base">→</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
