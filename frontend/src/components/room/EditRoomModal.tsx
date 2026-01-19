import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import Modal from "@/components/shared/modal/Modal";
import translationKey from "@/utils/i18n/translationKey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hash, Layers } from "lucide-react";
import { toast } from "sonner";
import {
    ROOM_STATUS_WITH_ICON_AND_TRANSLATION,
    type ROOM_STATUS_WITH_ICON_AND_TRANSLATION_TYPE,
} from "@/constants/roomConstants/roomStatusWithIconAndTranslation";
import { editRoomMutationOptions } from "@/queryOptions/roomQueryOptions";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import type {
    IRoomInstance,
    IRoomVariantDetailResponse,
} from "@/types/api/responses/roomVariantDetailResponse";
import type { HttpResponse } from "@/types/api/responseType";

interface EditRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: IRoomInstance;
    roomVariantId: string;
}

type RoomStatus = "ACTIVE" | "OCCUPIED" | "MAINTENANCE" | "INACTIVE";

export default function EditRoomModal({
    isOpen,
    onClose,
    room,
    roomVariantId,
}: EditRoomModalProps) {
    const { t } = useTranslation();

    const [roomCode, setRoomCode] = useState(room.roomCode);
    const [floor, setFloor] = useState(room.floor.toString());
    const [status, setStatus] = useState<RoomStatus>(room.status as RoomStatus);

    useEffect(() => {
        if (isOpen) {
            setRoomCode(room.roomCode);
            setFloor(room.floor.toString());
            setStatus(room.status as RoomStatus);
        }
    }, [isOpen, room]);

    const { mutate, isPending } = useMutation(editRoomMutationOptions(room.id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!roomCode.trim()) {
            toast.error(t(translationKey.errors.roomCodeRequired));
            return;
        }

        if (!floor || isNaN(Number(floor))) {
            toast.error(t(translationKey.errors.floorNumberRequired));
            return;
        }

        mutate(
            {
                ...(room.roomCode !== roomCode.trim() && {
                    roomCode: roomCode.trim(),
                }),
                ...(room.floor !== Number(floor) && { floor: Number(floor) }),
                ...(room.status !== status && { status }),
            },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    onClose();
                    queryClient.setQueryData(
                        [QUERY_KEYS.ROOM_VARIANT, roomVariantId],
                        (
                            prevData: HttpResponse<IRoomVariantDetailResponse>
                        ) => {
                            if (!prevData) return prevData;
                            const cloneData = structuredClone(prevData);

                            if (cloneData.data?.rooms) {
                                cloneData.data.rooms = cloneData.data.rooms.map(
                                    (r) => {
                                        if (r.id === room.id) {
                                            return {
                                                ...r,
                                                roomCode: roomCode.trim(),
                                                floor: Number(floor),
                                                status,
                                            };
                                        }
                                        return r;
                                    }
                                );
                            }
                            return cloneData;
                        }
                    );
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
    };

    return (
        <Modal isOpen={isOpen} handleClose={onClose}>
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {t(
                            translationKey.headings.editRoomInstance ||
                                "editRoomInstance"
                        )}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {t(translationKey.text.configureRoomDetails)}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label
                                htmlFor="roomCode"
                                className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"
                            >
                                <Hash className="w-3 h-3" />
                                {t(translationKey.form.roomCode)}
                            </Label>
                            <Input
                                id="roomCode"
                                type="text"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                placeholder="e.g. 101"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="floor"
                                className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"
                            >
                                <Layers className="w-3 h-3" />
                                {t(translationKey.text.floorNumber)}
                            </Label>
                            <Input
                                id="floor"
                                type="number"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                placeholder="e.g. 1"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            {t(translationKey.text.currentStatus)}
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                            {ROOM_STATUS_WITH_ICON_AND_TRANSLATION.map(
                                (
                                    option: ROOM_STATUS_WITH_ICON_AND_TRANSLATION_TYPE
                                ) => (
                                    <Button
                                        key={option.value}
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setStatus(
                                                option.value as RoomStatus
                                            )
                                        }
                                        className={`flex flex-col items-center gap-1 h-auto p-2 ${
                                            status === option.value
                                                ? "border-gray-900 bg-gray-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                status === option.value
                                                    ? "text-gray-900"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            <option.icon className="w-4 h-4" />
                                        </div>
                                        <span
                                            className={`text-[10px] font-medium uppercase tracking-wider ${
                                                status === option.value
                                                    ? "text-gray-900"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {t(option.labelKey)}
                                        </span>
                                    </Button>
                                )
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending
                            ? t(translationKey.button.saving)
                            : t(
                                  translationKey.button.updateRoom ||
                                      "updateRoom"
                              )}
                    </Button>
                </form>
            </div>
        </Modal>
    );
}
