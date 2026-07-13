import { createGetCabDetailsQueryOptions } from "@/queryOptions/cabQueryOptions";
import { useQuery } from "@tanstack/react-query";
import ImageScroll from "./ImageScroll";
import VehicleModel from "./VehicleModel";
import RegistrationNumber from "./RegistrationNumber";
import NoVehicleDetails from "./NoVehicleDetails";
import Loading from "@/components/shared/loading/Loading";
import AddVehicleComponentWithButton from "./AddVehicleComponentWithButton";

function CabDetails() {
    const { data, isLoading } = useQuery(createGetCabDetailsQueryOptions());
    const vehicleDetails = data?.data?.vehicleDetails;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="w-full bg-gray-50/50 p-0 sm:p-4 flex justify-center items-start">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] flex flex-col gap-8 p-4 sm:p-6 md:p-10">
                {!vehicleDetails?.model ? (
                    <NoVehicleDetails />
                ) : (
                    <>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
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
