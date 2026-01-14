import Table from "@/components/shared/Table/Table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IFindDestinationsResponse } from "@/types/api/responses/findDestinationAdminResponse";
import { destinationTypeIcons } from "@/constants/destinationConstants/destinationTypeIcons";
import { currencyIcons } from "@/constants/destinationConstants/currencyIcons";
import translationKey from "@/utils/i18n/translationKey";
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Pencil, ImageOff } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Destination = IFindDestinationsResponse["destinations"][number];

interface DestinationsTableProps {
    data: Destination[];
    handleStatusChange?: (id: string, status: boolean) => void;
}

function DestinationsTable({
    data,
    handleStatusChange,
}: DestinationsTableProps) {
    const { t } = useTranslation();

    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                {t(translationKey.text.noDestinationsFound)}
            </div>
        );
    }

    return (
        <div className="w-full">
            <Table
                headers={[
                    {
                        id: "destination",
                        label: t(translationKey.tableHeaders.destination),
                        render: (row: Destination) => (
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    {row.coverImage ? (
                                        <img
                                            src={row.coverImage}
                                            alt={row.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageOff className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {row.name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {row.tagline}
                                    </p>
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "type",
                        label: t(translationKey.tableHeaders.type),
                        render: (row: Destination) => {
                            const TypeIcon = destinationTypeIcons[row.type];
                            return (
                                <div className="flex items-center gap-2">
                                    {TypeIcon && (
                                        <TypeIcon className="w-4 h-4 text-gray-600" />
                                    )}
                                    <span className="text-gray-700">
                                        {t(
                                            translationKey.destinationTypes[
                                                row.type
                                            ]
                                        )}
                                    </span>
                                </div>
                            );
                        },
                    },
                    {
                        id: "fee",
                        label: t(translationKey.tableHeaders.fee),
                        render: (row: Destination) => {
                            if (row.isFree) {
                                return (
                                    <Badge
                                        variant="outline"
                                        className="border-gray-300 text-gray-600 font-medium"
                                    >
                                        {t(translationKey.text.free)}
                                    </Badge>
                                );
                            }
                            const CurrencyIcon = currencyIcons[row.currency];
                            return (
                                <div className="flex items-center gap-1 text-gray-800">
                                    {CurrencyIcon && (
                                        <CurrencyIcon className="w-4 h-4" />
                                    )}
                                    <span>{row.entryFee.toFixed(2)}</span>
                                </div>
                            );
                        },
                    },
                    {
                        id: "status",
                        label: t(translationKey.tableHeaders.status),
                        render: (row: Destination) => (
                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Switch
                                        checked={row.isActive}
                                        onCheckedChange={(checked: boolean) =>
                                            handleStatusChange?.(
                                                row.id,
                                                checked
                                            )
                                        }
                                    />
                                </motion.div>
                                <Link to="/admin/addDestinations">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-gray-700"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                </Link>
                            </div>
                        ),
                    },
                ]}
                data={data}
            />
        </div>
    );
}

export default React.memo(DestinationsTable);
