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
import {
    Search,
    RotateCcw,
    ChevronDown,
    Layers,
    Gift,
    CreditCard,
    Activity,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { destinationTypeIcons } from "@/constants/destinationConstants/destinationTypeIcons";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

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

            <motion.div variants={itemVariants} custom={1}>
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <div className="flex items-center gap-2 truncate text-gray-700">
                                {localFilter.type &&
                                localFilter.type.length > 0 ? (
                                    <>
                                        {localFilter.type.length === 1 ? (
                                            <>
                                                {(() => {
                                                    const Icon =
                                                        destinationTypeIcons[
                                                            localFilter.type[0]
                                                        ];
                                                    return (
                                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                                    );
                                                })()}
                                                <span className="truncate">
                                                    {t(
                                                        translationKey
                                                            .destinationTypes[
                                                            localFilter.type[0]
                                                        ]
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-semibold text-gray-900">
                                                {localFilter.type.length}{" "}
                                                {t(
                                                    translationKey.tableHeaders
                                                        .type
                                                )}{" "}
                                                {t(
                                                    translationKey.button
                                                        .selected
                                                )}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Layers className="w-4 h-4 text-muted-foreground" />
                                        <span>
                                            {t(translationKey.text.allTypes)}
                                        </span>
                                    </>
                                )}
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[220px] p-2" align="start">
                        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setLocalFilter((prev) => ({
                                        ...prev,
                                        type: undefined,
                                    }));
                                }}
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 transition-colors text-left"
                            >
                                <Checkbox
                                    checked={
                                        !localFilter.type ||
                                        localFilter.type.length === 0
                                    }
                                    onCheckedChange={() => {
                                        setLocalFilter((prev) => ({
                                            ...prev,
                                            type: undefined,
                                        }));
                                    }}
                                />
                                <Layers className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {t(translationKey.text.allTypes)}
                                </span>
                            </button>
                            <div className="h-px bg-gray-100 my-1 mx-[-4px]" />
                            {Object.values(DESTINATION_TYPES).map((type) => {
                                const Icon = destinationTypeIcons[type];
                                const isSelected =
                                    localFilter.type?.includes(type);
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => {
                                            setLocalFilter((prev) => {
                                                const current = prev.type || [];
                                                if (current.includes(type)) {
                                                    const filtered =
                                                        current.filter(
                                                            (t) => t !== type
                                                        );
                                                    return {
                                                        ...prev,
                                                        type:
                                                            filtered.length > 0
                                                                ? filtered
                                                                : undefined,
                                                    };
                                                }
                                                return {
                                                    ...prev,
                                                    type: [...current, type],
                                                };
                                            });
                                        }}
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 transition-colors text-left"
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => {}}
                                        />
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                        <span className="truncate">
                                            {t(
                                                translationKey.destinationTypes[
                                                    type
                                                ]
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </PopoverContent>
                </Popover>
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
                            <Layers className="w-4 h-4 opacity-70" />
                            {t(translationKey.button.all)}
                        </SelectItem>
                        <SelectItem value="free">
                            <Gift className="w-4 h-4 opacity-70 text-green-600" />
                            {t(translationKey.text.free)}
                        </SelectItem>
                        <SelectItem value="paid">
                            <CreditCard className="w-4 h-4 opacity-70 text-blue-600" />
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
                            <Activity className="w-4 h-4 opacity-70" />
                            {t(translationKey.button.all)}
                        </SelectItem>
                        <SelectItem value="active">
                            <CheckCircle2 className="w-4 h-4 opacity-70 text-green-600" />
                            {t(translationKey.button.active)}
                        </SelectItem>
                        <SelectItem value="inactive">
                            <XCircle className="w-4 h-4 opacity-70 text-red-600" />
                            {t(translationKey.text.inactive)}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

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
