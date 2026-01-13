import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, RotateCcw } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

export interface DestinationsFilter {
    pageNo: number;
    query: string;
    type?: DESTINATION_TYPES[];
    isFree?: boolean;
    isActive?: boolean;
}

interface SearchBarProps {
    filter: DestinationsFilter;
    setFilter: Dispatch<SetStateAction<DestinationsFilter>>;
}

const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.25 },
    }),
};

function SearchBar({ filter, setFilter }: SearchBarProps) {
    const { t } = useTranslation();

    // Local state for inputs - only updates filter on search click
    const [localFilter, setLocalFilter] = useState({
        query: filter.query,
        type: filter.type,
        isFree: filter.isFree,
        isActive: filter.isActive,
    });

    function handleSearch() {
        setFilter({
            pageNo: 1,
            ...localFilter,
        });
    }

    function handleReset() {
        const resetState = {
            query: "",
            type: undefined,
            isFree: undefined,
            isActive: undefined,
        };
        setLocalFilter(resetState);
        setFilter({
            pageNo: 1,
            ...resetState,
        });
    }

    return (
        <motion.div
            className="p-2 flex flex-wrap gap-3 items-center"
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={itemVariants}
                custom={0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        className="pl-9 w-[250px]"
                        placeholder={t(
                            translationKey.text.searchByNameOrTagline
                        )}
                        value={localFilter.query}
                        onChange={(e) =>
                            setLocalFilter((prev) => ({
                                ...prev,
                                query: e.target.value,
                            }))
                        }
                    />
                </div>
            </motion.div>

            <motion.div
                variants={itemVariants}
                custom={1}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Select
                    value={localFilter.type?.[0] ?? "all"}
                    onValueChange={(val) =>
                        setLocalFilter((prev) => ({
                            ...prev,
                            type:
                                val === "all"
                                    ? undefined
                                    : [val as DESTINATION_TYPES],
                        }))
                    }
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue
                            placeholder={t(translationKey.text.allTypes)}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t(translationKey.text.allTypes)}
                        </SelectItem>
                        {Object.values(DESTINATION_TYPES).map((type) => (
                            <SelectItem key={type} value={type}>
                                {t(translationKey.destinationTypes[type])}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </motion.div>

            <motion.div
                variants={itemVariants}
                custom={2}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Select
                    value={
                        localFilter.isFree === undefined
                            ? "all"
                            : localFilter.isFree
                              ? "free"
                              : "paid"
                    }
                    onValueChange={(val) =>
                        setLocalFilter((prev) => ({
                            ...prev,
                            isFree: val === "all" ? undefined : val === "free",
                        }))
                    }
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue
                            placeholder={t(translationKey.text.isFree)}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t(translationKey.button.all)}
                        </SelectItem>
                        <SelectItem value="free">
                            {t(translationKey.text.free)}
                        </SelectItem>
                        <SelectItem value="paid">
                            {t(translationKey.text.paid)}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

            <motion.div
                variants={itemVariants}
                custom={3}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Select
                    value={
                        localFilter.isActive === undefined
                            ? "all"
                            : localFilter.isActive
                              ? "active"
                              : "inactive"
                    }
                    onValueChange={(val) =>
                        setLocalFilter((prev) => ({
                            ...prev,
                            isActive:
                                val === "all" ? undefined : val === "active",
                        }))
                    }
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue
                            placeholder={t(translationKey.text.isActive)}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t(translationKey.button.all)}
                        </SelectItem>
                        <SelectItem value="active">
                            {t(translationKey.button.active)}
                        </SelectItem>
                        <SelectItem value="inactive">
                            {t(translationKey.text.inactive)}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

            {/* Reset Button */}
            <motion.div
                variants={itemVariants}
                custom={4}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <RotateCcw className="w-4 h-4" />
                    {t(translationKey.button.reset)}
                </Button>
            </motion.div>

            <motion.div
                variants={itemVariants}
                custom={5}
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

export default SearchBar;
