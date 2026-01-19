import { useTranslation } from "react-i18next";
import { ChevronDown, Layers } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import { activityTypeIcons } from "@/constants/destinationConstants/activityTypeIcons";
import translationKey from "@/utils/i18n/translationKey";

interface ActivitySelectPopoverProps {
    selectedActivities: ACTIVITY_TYPE[] | undefined;
    onActivityChange: (activities: ACTIVITY_TYPE[] | undefined) => void;
}

function ActivitySelectPopover({
    selectedActivities,
    onActivityChange,
}: ActivitySelectPopoverProps) {
    const { t } = useTranslation();

    const handleToggleActivity = (activity: ACTIVITY_TYPE) => {
        const current = selectedActivities || [];
        if (current.includes(activity)) {
            const filtered = current.filter((a) => a !== activity);
            onActivityChange(filtered.length > 0 ? filtered : undefined);
        } else {
            onActivityChange([...current, activity]);
        }
    };

    return (
        <div>
            <Label className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                {t(translationKey.form.activities)}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <div className="flex items-center gap-2 truncate text-gray-700">
                            {selectedActivities &&
                            selectedActivities.length > 0 ? (
                                <span className="font-medium">
                                    {selectedActivities.length}{" "}
                                    {t(translationKey.button.selected)}
                                </span>
                            ) : (
                                <>
                                    <Layers className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        {t(translationKey.text.allActivities)}
                                    </span>
                                </>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-2" align="start">
                    <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                        <button
                            type="button"
                            onClick={() => onActivityChange(undefined)}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 transition-colors text-left"
                        >
                            <Checkbox
                                checked={
                                    !selectedActivities ||
                                    selectedActivities.length === 0
                                }
                            />
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                                {t(translationKey.text.allActivities)}
                            </span>
                        </button>
                        <div className="h-px bg-gray-100 my-1 mx-[-4px]" />
                        {Object.values(ACTIVITY_TYPE).map((activity) => {
                            const Icon = activityTypeIcons[activity];
                            const isSelected =
                                selectedActivities?.includes(activity);
                            return (
                                <button
                                    key={activity}
                                    type="button"
                                    onClick={() =>
                                        handleToggleActivity(activity)
                                    }
                                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 transition-colors text-left"
                                >
                                    <Checkbox checked={isSelected} />
                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                    <span className="truncate">
                                        {t(translationKey.activities[activity])}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default ActivitySelectPopover;
