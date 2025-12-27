import {
    createGetCabDetailsQueryOptions,
    createUpdateVehicleMutationOption,
} from "@/queryOptions/cabQueryOptions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import BaseLocation from "./BaseLocation";
import ImageScroll from "./ImageScroll";
import VehicleModel from "./VehicleModel";
import RegistrationNumber from "./RegistrationNumber";
import CabStatus from "./CabStatus";
import NoVehicleDetails from "./NoVehicleDetails";
import Loading from "@/components/shared/loading/Loading";
import AddVehicleComponentWithButton from "./AddVehicleComponentWithButton";
import { toast } from "sonner";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import type { HttpResponse } from "@/types/api/responseType";
import type { ICabDetailsResponseDTO } from "@/types/api/responses/cabResponses";

function CabDetails() {
    const { data, isLoading } = useQuery(createGetCabDetailsQueryOptions());
    const vehicleDetails = data?.data?.vehicleDetails;
    const baseLocation = data?.data?.baseLocation;
    const [isOnline, setIsOnline] = useState(data?.data?.isOnline ?? true);
    const { mutate: updateVehicleMutate } = useMutation(
        createUpdateVehicleMutationOption()
    );

    // Sync isOnline state with server data
    useEffect(() => {
        if (data?.data?.isOnline !== undefined) {
            setIsOnline(data.data.isOnline);
        }
    }, [data?.data?.isOnline]);

    const handleLocationChange = (
        city: string,
        coordinates: [number, number]
    ) => {
        const formData = new FormData();
        formData.append("baseLocation[city]", city);
        formData.append(
            "baseLocation[coordinates][0]",
            coordinates[0].toString()
        );
        formData.append(
            "baseLocation[coordinates][1]",
            coordinates[1].toString()
        );

        updateVehicleMutate(formData, {
            onSuccess: (response) => {
                toast.success(response.message);
                queryClient.setQueriesData(
                    { queryKey: [QUERY_KEYS.CAB_DETAILS] },
                    (
                        prevData:
                            | HttpResponse<ICabDetailsResponseDTO>
                            | undefined
                    ) => {
                        if (!prevData || !prevData.data) return prevData;

                        const clone = structuredClone(prevData);
                        if (clone.data) {
                            clone.data.baseLocation = {
                                city: city,
                                coordinates: coordinates,
                            };
                        }
                        return clone;
                    }
                );
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    };

    const handleStatusToggle = (status: boolean) => {
        setIsOnline(status);

        const formData = new FormData();
        formData.append("isOnline", status.toString());

        updateVehicleMutate(formData, {
            onSuccess: (response) => {
                toast.success(response.message);
                queryClient.setQueriesData(
                    { queryKey: [QUERY_KEYS.CAB_DETAILS] },
                    (
                        prevData:
                            | HttpResponse<ICabDetailsResponseDTO>
                            | undefined
                    ) => {
                        if (!prevData || !prevData.data) return prevData;

                        const clone = structuredClone(prevData);
                        if (clone.data) {
                            clone.data.isOnline = status;
                        }
                        return clone;
                    }
                );
            },
            onError: (err) => {
                toast.error(err.message);
                // Revert optimistic update on error
                setIsOnline(!status);
            },
        });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="w-full bg-gray-50/50 p-4 flex justify-center items-start">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] flex flex-col gap-8 p-6 md:p-10">
                <div className="flex flex-col gap-6">
                    <CabStatus
                        isOnline={isOnline}
                        onToggle={handleStatusToggle}
                    />

                    <BaseLocation
                        baseLocation={baseLocation?.city}
                        onLocationChange={handleLocationChange}
                    />
                </div>

                {!vehicleDetails?.model ? (
                    <NoVehicleDetails />
                ) : (
                    <>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                    {vehicleDetails.model}
                                </h1>
                                <AddVehicleComponentWithButton
                                    vehicleDetails={data?.data?.vehicleDetails}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <VehicleModel
                                    vehicleType={vehicleDetails.type}
                                    modelName={vehicleDetails.model}
                                />
                                <RegistrationNumber
                                    registrationNumber={
                                        vehicleDetails.registrationNumber
                                    }
                                />
                            </div>
                        </div>
                        <div className="w-full -mx-2">
                            <ImageScroll
                                images={
                                    vehicleDetails.images &&
                                    vehicleDetails.images.length > 0
                                        ? vehicleDetails.images
                                        : []
                                }
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CabDetails;
