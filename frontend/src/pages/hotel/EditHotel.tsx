import { EditHotelForm } from "@/components/hotel/EditHotel/EditHotelForm";
import Loading from "@/components/shared/loading/Loading";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import translationKey from "@/utils/i18n/translationKey";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

const routeApi = getRouteApi("/hotel/hotels/edit/$hotelId");

function EditHotelContent() {
    const { hotelId } = routeApi.useParams();
    const { t } = useTranslation();

    const {
        data: { data: hotelData },
    } = useSuspenseQuery(createGetHotelByIdQueryOptions(hotelId));

    if (!hotelData) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                    {t(translationKey.text.noHotelFound)}
                </p>
            </div>
        );
    }

    return <EditHotelForm hotelData={hotelData} />;
}

function EditHotel() {
    return (
        <Suspense
            fallback={
                <div className="h-full w-full flex items-center justify-center">
                    <Loading />
                </div>
            }
        >
            <EditHotelContent />
        </Suspense>
    );
}

export default EditHotel;
