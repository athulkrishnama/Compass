import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { queryClient } from "@/config/tanstackQueryConfig";
import { AdminQueryKeys } from "@/constants/queryKeys/adminQueryKeys";
import { ROLES } from "@/constants/roles";
import type { filterType } from "@/pages/admin/Users";
import translationKey from "@/utils/i18n/translationKey";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface propType {
    filter: filterType;
    setFilter: Dispatch<SetStateAction<filterType>>;
}
function Filter({ filter, setFilter }: propType) {
    const { t } = useTranslation();

    function handleSearch(){
        queryClient.refetchQueries({queryKey: [AdminQueryKeys.USERS, filter.pageNo]})
    }
    return (
        <div className="p-2 flex gap-3">
            <Input
                placeholder={t(translationKey.text.enterNameToSearch)}
                value={filter.query}
                onChange={(e) =>
                    setFilter((prev) => ({
                        ...prev,
                        query: e.target.value,
                        pageNo: 1,
                    }))
                }
            />

            <Select
                value={filter.role}
                onValueChange={(val) =>
                    setFilter((prev) => ({
                        ...prev,
                        role: val as filterType["role"],
                        pageNo: 1,
                    }))
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue
                        placeholder={t(translationKey.text.selectRole)}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        {t(translationKey.button.all)}
                    </SelectItem>
                    {Object.values(ROLES)
                        .filter((role) => role !== ROLES.ADMIN)
                        .map((role) => (
                            <SelectItem value={role}>{role}</SelectItem>
                        ))}
                </SelectContent>
            </Select>

            <Select
                value={filter.status}
                onValueChange={(value) =>
                    setFilter((prev) => ({
                        ...prev,
                        status: value as filterType["status"],
                        pageNo: 1,
                    }))
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue
                        placeholder={t(translationKey.text.userStatus)}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        {t(translationKey.button.all)}
                    </SelectItem>
                    <SelectItem value="blocked">
                        {t(translationKey.button.blocked)}
                    </SelectItem>
                    <SelectItem value="active">
                        {t(translationKey.button.active)}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Button onClick={handleSearch}>{t(translationKey.button.search)}</Button>
        </div>
    );
}

export default Filter;
