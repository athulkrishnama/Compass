import Modal from "@/components/shared/modal/Modal";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import { dataTagErrorSymbol } from "@tanstack/react-query";
import { ShieldOff, Unlock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface propTypes {
    isOpen: boolean;
    handleClose: () => void;
    data: {
        name: string;
        status: boolean;
    };
    handleConfirm: () => void;
}
function StatusChangeModal({
    handleClose,
    isOpen,
    data,
    handleConfirm,
}: propTypes) {
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} handleClose={handleClose}>
            <div className="p-6 flex flex-col items-center text-center space-y-6">
                <div
                    className={`rounded-full p-3 ${
                        data.status
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                    }`}
                >
                    {data.status ? (
                        <ShieldOff className="h-6 w-6" />
                    ) : (
                        <Unlock className="h-6 w-6" />
                    )}
                </div>

                <h3 className="text-lg font-semibold">
                    {data.status
                        ? t(translationKey.text.areYouSureToBlock, {
                              name: data.name,
                          })
                        : t(translationKey.text.areYouSureToUnblock, {
                              name: data.name,
                          })}
                </h3>

                <div className="flex justify-center gap-3 pt-2">
                    <Button variant="outline" onClick={handleClose}>
                        {t(translationKey.button.cancel)}
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        variant={data.status ? "destructive" : "default"}
                        className="min-w-[100px]"
                    >
                        {data.status
                            ? t(translationKey.button.block)
                            : t(translationKey.button.unBlock)}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default StatusChangeModal;
