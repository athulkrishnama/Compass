import { useEffect, useState } from "react";
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
import {
    RoomStatus,
    type IUnAvailableRoom,
} from "@/types/api/responses/roomVariantDetailResponse";

interface EditUnavailableModalProps {
    isOpen: boolean;
    handleClose: () => void;
    roomPrefix: string;
    room: IUnAvailableRoom | null;
    onSubmit: (data: {
        id: string;
        status: RoomStatus;
        reason: string;
        startDate: string;
        endDate: string;
    }) => void;
}

export default function EditUnavailableModal({
    isOpen,
    handleClose,
    roomPrefix,
    room,
    onSubmit,
}: EditUnavailableModalProps) {
    const { t } = useTranslation();
    const [status, setStatus] = useState<RoomStatus>(RoomStatus.MAINTENANCE);
    const [reason, setReason] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        if (room) {
            setStatus(room.status);
            setReason(room.reason);
            setStartDate(
                room.startDate
                    ? new Date(room.startDate).toLocaleDateString("en-CA")
                    : ""
            );
            setEndDate(
                room.endDate
                    ? new Date(room.endDate).toLocaleDateString("en-CA")
                    : ""
            );
        }
    }, [room]);

    const handleSubmit = () => {
        if (!room) return;
        onSubmit({ id: room.id, status, reason, startDate, endDate });
        setStatus(RoomStatus.MAINTENANCE);
        setReason("");
        setStartDate("");
        setEndDate("");
    };

    if (!room) return null;

    return (
        <Modal isOpen={isOpen} handleClose={handleClose}>
            <h2 className="text-lg font-semibold text-gray-900">
                {t(translationKey.headings.editRoomStatus)}
            </h2>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="roomNumber">
                        {t(translationKey.text.roomNumberLabel)}
                    </Label>
                    <Input
                        id="roomNumber"
                        type="text"
                        value={`${roomPrefix}${room.roomNumber}`}
                        disabled
                        className="mt-1.5 bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t(translationKey.text.roomNumberCannotBeChanged)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="editStartDate">Start Date</Label>
                        <Input
                            id="editStartDate"
                            type="date"
                            value={startDate}
                            min={new Date().toLocaleDateString("en-CA")}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1.5"
                        />
                    </div>
                    <div>
                        <Label htmlFor="editEndDate">End Date</Label>
                        <Input
                            id="editEndDate"
                            type="date"
                            value={endDate}
                            min={
                                startDate ||
                                new Date().toLocaleDateString("en-CA")
                            }
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1.5"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="status">
                        {t(translationKey.text.status)}
                    </Label>
                    <Select
                        value={status}
                        onValueChange={(value: RoomStatus) => setStatus(value)}
                    >
                        <SelectTrigger className="mt-1.5">
                            <SelectValue
                                placeholder={t(
                                    translationKey.form.selectStatus
                                )}
                            />
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
                <Button onClick={handleSubmit} disabled={!reason}>
                    {t(translationKey.button.update)}
                </Button>
            </div>
        </Modal>
    );
}
