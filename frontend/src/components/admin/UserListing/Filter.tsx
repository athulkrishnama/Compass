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
import { motion } from "framer-motion";
import { FilterIcon, Search, UserCircle2 } from "lucide-react";

interface propType {
    filter: filterType;
    setFilter: Dispatch<SetStateAction<filterType>>;
}

const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.25 },
    }),
};

function Filter({ filter, setFilter }: propType) {
    const { t } = useTranslation();

    function handleSearch() {
        queryClient.refetchQueries({
            queryKey: [AdminQueryKeys.USERS, filter.pageNo],
        });
    }
    return (
        <motion.div
            className="p-2 flex flex-wrap gap-3 items-center"
            initial="hidden"
            animate="visible"
        >
            {/* Search Input */}
            <motion.div
                variants={itemVariants}
                custom={0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        className="pl-9"
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
                </div>
            </motion.div>

            {/* Role Select */}
            <motion.div
                variants={itemVariants}
                custom={1}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="relative">
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                        <SelectTrigger className="pl-9 w-[180px]">
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
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            {/* Status Select */}
            <motion.div
                variants={itemVariants}
                custom={2}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="relative">
                    <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                        <SelectTrigger className="pl-9 w-[180px]">
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
                </div>
            </motion.div>

            {/* Search Button */}
            <motion.div
                variants={itemVariants}
                custom={3}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                <Button
                    onClick={handleSearch}
                    className="flex items-center gap-2 bg-black text-white hover:bg-gray-900 transition-colors"
                >
                    <Search className="w-4 h-4" />
                    {t(translationKey.button.search)}
                </Button>
            </motion.div>
        </motion.div>
    );
}

export default Filter;
