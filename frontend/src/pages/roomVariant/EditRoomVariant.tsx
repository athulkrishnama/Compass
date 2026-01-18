import Loading from "@/components/shared/loading/Loading";
import { createGetRoomVariantByIdQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import translationKey from "@/utils/i18n/translationKey";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { EditRoomVariantForm } from "@/components/roomVariant/EditRoomVariant";

const routeApi = getRouteApi(
    "/hotel/hotels/$hotelId_/room-variants/$roomVariantId/edit"
);

function EditRoomVariantContent() {
    const { hotelId, roomVariantId } = routeApi.useParams();
    const { t } = useTranslation();

    const {
        data: { data: roomVariantData },
    } = useSuspenseQuery(createGetRoomVariantByIdQueryOptions(roomVariantId));

    const {
        data: { data: hotelData },
    } = useSuspenseQuery(createGetHotelByIdQueryOptions(hotelId));

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
        <EditRoomVariantForm
            roomVariantData={roomVariantData}
            hotelId={hotelId}
            hotelName={hotelData?.name || ""}
        />
    );
}

function EditRoomVariant() {
    return (
        <Suspense
            fallback={
                <div className="h-full w-full flex items-center justify-center">
                    <Loading />
                </div>
            }
        >
            <EditRoomVariantContent />
        </Suspense>
    );
}

export default EditRoomVariant;
