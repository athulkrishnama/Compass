import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import Loading from "@/components/shared/loading/Loading";
import HotelCoverImage from "@/components/hotel/HotelDetails/HotelCoverImage";
import GeneralInfoSection from "@/components/hotel/HotelDetails/GeneralInfoSection";
import LocationAddressSection from "@/components/hotel/HotelDetails/LocationAddressSection";
import PropertyGallerySection from "@/components/hotel/HotelDetails/PropertyGallerySection";
import { createGetRoomVariantByHotelIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import RoomVariantsSection from "@/components/hotel/HotelDetails/RoomVariantsSection";
import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

const routeApi = getRouteApi("/hotel/hotels/$hotelId");

function HotelDetailsContent() {
    const { hotelId } = routeApi.useParams();
    const { data } = useSuspenseQuery(createGetHotelByIdQueryOptions(hotelId));
    const { data: roomVariantsData } = useSuspenseQuery(
        createGetRoomVariantByHotelIdQueryOptions(hotelId)
    );
    const hotelData = data?.data;
    const { t } = useTranslation();

    if (!hotelData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Hotel not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-scroll  bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8 pb-16 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {hotelData.name}
                    </h1>
                    <Link
                        to="/hotel/hotels/$hotelId/report"
                        params={{ hotelId }}
                    >
                        <Button className="bg-black hover:bg-gray-900 text-white flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {t(translationKey.reports.title)}
                        </Button>
                    </Link>
                </div>

                <HotelCoverImage
                    coverImage={hotelData.coverImage}
                    name={hotelData.name}
                />

                <RoomVariantsSection
                    hotelId={hotelId}
                    roomVariants={roomVariantsData?.data?.roomVariants ?? []}
                />

                <div className="space-y-6">
                    <GeneralInfoSection
                        name={hotelData.name}
                        description={hotelData.description}
                    />
                    <LocationAddressSection
                        country={hotelData.country}
                        city={hotelData.city}
                        landMark={hotelData.landMark}
                        pinCode={hotelData.pinCode}
                        coordinates={hotelData.coordinates}
                    />
                </div>

                <PropertyGallerySection images={hotelData.images} />
            </div>
        </div>
    );
}

function HotelDetails() {
    return (
        <Suspense fallback={<Loading />}>
            <HotelDetailsContent />
        </Suspense>
    );
}

export default HotelDetails;
