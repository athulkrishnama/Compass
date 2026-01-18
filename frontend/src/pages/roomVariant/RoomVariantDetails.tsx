import Loading from "@/components/shared/loading/Loading";
import { createGetRoomVariantByIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import RoomVariantHeader from "@/components/roomVariant/RoomVariantDetails/RoomVariantHeader";
import RoomInstancesSection from "@/components/roomVariant/RoomVariantDetails/RoomInstancesSection";
import { ArrowLeft } from "lucide-react";

const routeApi = getRouteApi(
    "/hotel/hotels/$hotelId_/room-variants/$roomVariantId/"
);

function RoomVariantDetailsContent() {
    const { hotelId, roomVariantId } = routeApi.useParams();
    const { t } = useTranslation();

    const {
        data: { data: roomVariantData },
    } = useSuspenseQuery(createGetRoomVariantByIdQueryOptions(roomVariantId));

    if (!roomVariantData) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                    {t(translationKey.text.noRoomFound)}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                <Link
                    to="/hotel/hotels/$hotelId"
                    params={{ hotelId }}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t(translationKey.button.hotels)}
                </Link>

                <RoomVariantHeader roomVariant={roomVariantData} />

                <RoomInstancesSection
                    hotelId={hotelId}
                    roomVariantId={roomVariantId}
                    rooms={roomVariantData.rooms}
                />
            </div>
        </div>
    );
}

function RoomVariantDetails() {
    return (
        <Suspense
            fallback={
                <div className="h-full w-full flex items-center justify-center">
                    <Loading />
                </div>
            }
        >
            <RoomVariantDetailsContent />
        </Suspense>
    );
}

export default RoomVariantDetails;
