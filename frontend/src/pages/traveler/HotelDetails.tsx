import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { createGetRoomVariantByHotelIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import Loading from "@/components/shared/loading/Loading";
import HotelCoverImage from "@/components/hotel/HotelDetails/HotelCoverImage";
import GeneralInfoSection from "@/components/hotel/HotelDetails/GeneralInfoSection";
import LocationAddressSection from "@/components/hotel/HotelDetails/LocationAddressSection";
import PropertyGallerySection from "@/components/hotel/HotelDetails/PropertyGallerySection";
import TravelerRoomVariantsSection from "@/components/traveler/hotelDetails/TravelerRoomVariantsSection";
import translationKey from "@/utils/i18n/translationKey";

function HotelDetailsContent() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { hotelId } = useParams({ from: "/traveler/hotel/$hotelId" });

    const { data } = useSuspenseQuery(createGetHotelByIdQueryOptions(hotelId));
    const { data: roomVariantsData } = useSuspenseQuery(
        createGetRoomVariantByHotelIdQueryOptions(hotelId)
    );
    const hotelData = data?.data;

    if (!hotelData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    {t(translationKey.hotelSearch.noHotelsFound)}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="sticky top-6 z-50 w-fit ml-6 -mb-12"
            >
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigate({ to: "/traveler/hotels" })}
                    className="rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:bg-white border border-gray-100 w-12 h-12"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </Button>
            </motion.div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900 mb-6"
                >
                    {hotelData.name}
                </motion.h1>

                <HotelCoverImage
                    coverImage={hotelData.coverImage}
                    name={hotelData.name}
                />

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-10">
                        <GeneralInfoSection
                            name={hotelData.name}
                            description={hotelData.description}
                        />
                        <TravelerRoomVariantsSection
                            roomVariants={
                                roomVariantsData?.data?.roomVariants ?? []
                            }
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <LocationAddressSection
                            country={hotelData.country}
                            city={hotelData.city}
                            landMark={hotelData.landMark}
                            pinCode={hotelData.pinCode}
                            coordinates={hotelData.coordinates}
                        />
                    </div>
                </div>

                <PropertyGallerySection images={hotelData.images} />
            </main>
        </div>
    );
}

function TravelerHotelDetails() {
    return (
        <Suspense fallback={<Loading />}>
            <HotelDetailsContent />
        </Suspense>
    );
}

export default TravelerHotelDetails;
