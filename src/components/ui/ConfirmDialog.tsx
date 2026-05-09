import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "default",
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const confirm = confirmLabel ?? t("common.confirm");
  const cancel = cancelLabel ?? t("common.cancel");
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {cancel}
          </Button>
          <Button
            size="sm"
            className={variant === "danger" ? "bg-red-600 hover:bg-red-700" : ""}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
