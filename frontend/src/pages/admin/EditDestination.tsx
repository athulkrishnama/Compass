import { EditDestinationForm } from "@/components/admin/EditDestination";
import Loading from "@/components/shared/loading/Loading";
import { createFindDestinationByIdQueryOption } from "@/queryOptions/adminQueryOptions";
import translationKey from "@/utils/i18n/translationKey";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

const routeApi = getRouteApi("/admin/edit-destination/$destinationId");

function EditDestinationContent() {
    const { destinationId } = routeApi.useParams();
    const { t } = useTranslation();

    const {
        data: { data: destinationData },
    } = useSuspenseQuery(createFindDestinationByIdQueryOption(destinationId));

    if (!destinationData) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                    {t(translationKey.text.noDestinationsFound)}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                    {t(translationKey.headings.editDestination)}:{" "}
                    {destinationData.name}
                </h1>
                <p className="text-sm text-gray-500">
                    {t(translationKey.headings.editDestinationSubtitle)}
                </p>
            </div>
            <EditDestinationForm destinationData={destinationData} />
        </div>
    );
}

function EditDestination() {
    return (
        <Suspense
            fallback={
                <div className="h-full w-full flex items-center justify-center">
                    <Loading />
                </div>
            }
        >
            <EditDestinationContent />
        </Suspense>
    );
}

export default EditDestination;
