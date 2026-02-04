"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                "p-5 bg-white rounded-3xl shadow-xl border border-gray-100",
                className
            )}
            classNames={{
                months: "relative flex flex-col gap-6",
                month: "flex flex-col gap-5",
                month_caption: "flex items-center justify-center h-9",
                caption_label: "text-base font-semibold",
                nav: "absolute top-0 flex w-full justify-between px-1",
                button_previous:
                    "size-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm",
                button_next:
                    "size-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm",
                month_grid: "w-full border-collapse",
                weekdays: "flex",
                weekday:
                    "text-muted-foreground w-11 font-medium text-sm text-center",
                week: "flex w-full mt-3",
                day: "relative p-0 text-center text-sm size-11",
                day_button:
                    "size-11 p-0 font-medium rounded-xl hover:bg-gray-100 transition-colors",
                range_start:
                    "rounded-l-full [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:rounded-l-full [&>button]:rounded-r-none [&>button]:shadow-md",
                range_end:
                    "rounded-r-full [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:rounded-r-full [&>button]:rounded-l-none [&>button]:shadow-md",
                range_middle:
                    "bg-primary/10 [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:rounded-none",
                selected:
                    "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:shadow-md",
                today: "[&>button]:bg-gray-200 [&>button]:text-gray-900 [&>button]:font-bold",
                outside:
                    "text-muted-foreground opacity-40 [&>button]:bg-transparent",
                disabled: "text-muted-foreground opacity-50",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) => {
                    const Icon =
                        orientation === "left" ? ChevronLeft : ChevronRight;
                    return <Icon className="size-5" />;
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
