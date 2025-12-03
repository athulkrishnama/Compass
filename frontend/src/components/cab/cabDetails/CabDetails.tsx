import { createGetCabDetailsQueryOptions } from "@/queryOptions/cabQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import BaseLocation from "./BaseLocation";
import ImageScroll from "./ImageScroll";
import VehicleModel from "./VehicleModel";
import RegistrationNumber from "./RegistrationNumber";
import CabStatus from "./CabStatus";
import NoVehicleDetails from "./NoVehicleDetails";
import Loading from "@/components/shared/loading/Loading";

function CabDetails() {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery(createGetCabDetailsQueryOptions());
    const vehicleDetails = data?.data?.vehicleDetails;
    const baseLocation = data?.data?.baseLocation;
    const [isOnline, setIsOnline] = useState(true);

    const handleAddVehicle = () => {
        console.log("Add vehicle clicked");
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="w-full bg-gray-50/50 p-4 flex justify-center items-start">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] flex flex-col gap-8 p-6 md:p-10">
                <div className="flex flex-col gap-6">
                    <CabStatus isOnline={isOnline} onToggle={setIsOnline} />

                    <BaseLocation
                        baseLocation={baseLocation}
                        onLocationChange={() => console.log("Change location")}
                    />
                </div>

                {!vehicleDetails?.model ? (
                    <NoVehicleDetails onAddVehicle={handleAddVehicle} />
                ) : (
                    <>
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

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                    {vehicleDetails.model}
                                </h1>
                                <Button
                                    variant="secondary"
                                    className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-6 flex items-center gap-2 text-sm uppercase tracking-wide"
                                >
                                    <Pencil className="w-4 h-4" />
                                    {t("button.editVehicle")}
                                </Button>
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
                    </>
                )}
            </div>
        </div>
    );
}

export default CabDetails;
