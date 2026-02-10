import { useState } from "react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import Modal from "@/components/shared/modal/Modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RoomStatus } from "@/types/api/responses/roomVariantDetailResponse";

interface MarkUnavailableModalProps {
    isOpen: boolean;
    handleClose: () => void;
    roomPrefix: string;
    totalRoom: number;
    onSubmit: (data: {
        roomNumber: string;
        status: RoomStatus;
        reason: string;
    }) => void;
}

export default function MarkUnavailableModal({
    isOpen,
    handleClose,
    roomPrefix,
    totalRoom,
    onSubmit,
}: MarkUnavailableModalProps) {
    const { t } = useTranslation();
    const [roomNumber, setRoomNumber] = useState("");
    const [status, setStatus] = useState<RoomStatus>(RoomStatus.MAINTENANCE);
    const [reason, setReason] = useState("");
    const isRoomExceeded = Number(roomNumber) > totalRoom;

    const handleSubmit = () => {
        onSubmit({ roomNumber, status, reason });
        setRoomNumber("");
        setStatus(RoomStatus.MAINTENANCE);
        setReason("");
    };

    return (
        <Modal isOpen={isOpen} handleClose={handleClose}>
            <h2 className="text-lg font-semibold text-gray-900">
                {t(translationKey.text.markRoomUnavailable)}
            </h2>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="roomNumber">
                        {t(translationKey.text.roomNumberLabel)}
                    </Label>
                    <Input
                        id="roomNumber"
                        type="number"
                        placeholder="e.g., 101, 102"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="mt-1.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t(translationKey.text.fullRoomCode)}: {roomPrefix}
                        {roomNumber || "___"}
                    </p>
                    {isRoomExceeded && (
                        <p className="text-xs text-red-500 mt-1">
                            {t(translationKey.errors.roomNumberExceedsTotal, {
                                total: totalRoom,
                            })}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={status}
                        onValueChange={(value: RoomStatus) => setStatus(value)}
                    >
                        <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={RoomStatus.MAINTENANCE}>
                                {t(translationKey.text.maintenance)}
                            </SelectItem>
                            <SelectItem value={RoomStatus.BLOCKED}>
                                {t(translationKey.text.blocked)}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="reason">
                        {t(translationKey.text.reasonLabel)}
                    </Label>
                    <Textarea
                        id="reason"
                        placeholder={t(
                            translationKey.text.enterReasonPlaceholder
                        )}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1.5 resize-none"
                        rows={3}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={handleClose}>
                    {t(translationKey.button.cancel)}
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!roomNumber || !reason || isRoomExceeded}
                >
                    {t(translationKey.text.markUnavailable)}
                </Button>
            </div>
        </Modal>
    );
}
