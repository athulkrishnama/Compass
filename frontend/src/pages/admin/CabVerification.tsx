import UserTable from "@/components/admin/UnverifiedUserListing/UserTable";
import Pagination from "@/components/shared/Pagination/Pagination";
import { Input } from "@/components/ui/input";
import { ROLES } from "@/constants/roles";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { createGetUnverifiedUsersQueryOptions } from "@/queryOptions/adminQueryOptions";
import translationKey from "@/utils/i18n/translationKey";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function CabVerification() {
    const { t } = useTranslation();
    const [pageNo, setPageNO] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounceValue(search, 300);
    const { data } = useQuery(
        createGetUnverifiedUsersQueryOptions(pageNo, ROLES.CAB, debouncedSearch)
    );

    useEffect(() => {
        setPageNO(1);
    }, [debouncedSearch]);

    return (
        <div className="space-y-6 p-8 flex flex-col h-full pb-20">
            <h1 className="text-2xl font-bold text-black">
                {t(translationKey.headings.cabVerification)}
            </h1>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t(translationKey.text.enterNameToSearch)}
                    className="w-full md:w-1/4 pl-9"
                />
            </div>
            <div className="grow flex flex-col justify-between">
                {data?.data?.users.length ? (
                    <UserTable users={data.data.users} />
                ) : (
                    <div className="text-sm text-[#666] rounded-md border border-[#eee] p-4">
                        {t(translationKey.text.noUsersToShow)}
                    </div>
                )}

                {(data?.data?.totalPages ?? 0) > 1 ? (
                    <Pagination
                        currentPage={pageNo}
                        totalPages={data?.data?.totalPages ?? 1}
                        setPage={(no) => setPageNO(no)}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default CabVerification;
