import SearchBar, {
    type DestinationsFilter,
} from "@/components/admin/Destinations/SearchBar";
import DestinationsTable from "@/components/admin/Destinations/DestinationsTable";
import Pagination from "@/components/shared/Pagination/Pagination";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import Loading from "@/components/shared/loading/Loading";
import { toast } from "sonner";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import type { HttpResponse } from "@/types/api/responseType";
import type { IFindDestinationsResponse } from "@/types/api/responses/findDestinationAdminResponse";
import {
    createFindDestinationsQueryOption,
    createUpdateDestinationMutationOption,
} from "@/queryOptions/destinationQueryOptions";

function Destinations() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<DestinationsFilter>({
        pageNo: 1,
        query: "",
        type: undefined,
        isFree: undefined,
        isActive: undefined,
    });

    const { data, isLoading } = useQuery(
        createFindDestinationsQueryOption(filter)
    );

    const { mutate } = useMutation(createUpdateDestinationMutationOption());

    const setPage = (no: number) =>
        setFilter((prev) => ({ ...prev, pageNo: no }));

    function handleStatusChange(id: string, status: boolean) {
        const formData = new FormData();
        formData.append("isActive", status.toString());
        mutate(
            { id, data: formData },
            {
                onSuccess: (res) => {
                    queryClient.setQueryData(
                        [QUERY_KEYS.DESTINATIONS, filter],
                        (prevData: HttpResponse<IFindDestinationsResponse>) => {
                            const clone = structuredClone(prevData);

                            if (clone.data?.destinations) {
                                clone.data.destinations =
                                    clone.data.destinations.map(
                                        (destination) => {
                                            if (destination.id === id) {
                                                destination.isActive = status;
                                            }
                                            return destination;
                                        }
                                    );
                            }
                            return clone;
                        }
                    );
                    toast.success(res.message);
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
    }

    const destinationData = data?.data;
    return (
        <div className="p-8 bg-white rounded-2xl shadow-sm h-full flex flex-col pb-40">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {t(translationKey.headings.destinationList)}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {t(translationKey.headings.destinationListSubtitle)}
                    </p>
                </div>
                <Link to="/admin/addDestinations">
                    <Button className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4" />
                        {t(translationKey.button.newDestination)}
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col flex-grow">
                <div className="mb-3">
                    <SearchBar filter={filter} setFilter={setFilter} />
                </div>

                <div className="flex-grow min-h-[400px]">
                    {isLoading ? (
                        <Loading />
                    ) : destinationData?.destinations?.length ? (
                        <div className="h-full overflow-auto">
                            <DestinationsTable
                                data={destinationData.destinations}
                                handleStatusChange={handleStatusChange}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                            {t(translationKey.text.noDestinationsFound)}
                        </div>
                    )}
                </div>

                {destinationData?.destinations?.length &&
                destinationData.totalPages > 1 ? (
                    <div className="flex justify-center mt-3 mb-1">
                        <Pagination
                            totalPages={destinationData.totalPages}
                            currentPage={filter.pageNo}
                            setPage={setPage}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Destinations;
