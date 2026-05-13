import { useEffect, useMemo, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  file: File | null;
  aspect: number;
  onConfirm: (cropped: File) => void;
  onCancel: () => void;
};

async function createCroppedFile(
  imageSrc: string,
  croppedAreaPixels: Area,
  originalName: string
): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Falha ao gerar imagem recortada"));
          return;
        }
        const ext = originalName.split(".").pop() ?? "jpg";
        const baseName = originalName.replace(/\.[^.]+$/, "");
        resolve(
          new File([blob], `${baseName}-cropped.${ext}`, { type: blob.type })
        );
      },
      "image/jpeg",
      0.95
    );
  });
}

type PanelProps = {
  imageSrc: string;
  aspect: number;
  fileName: string;
  saving: boolean;
  onCancel: () => void;
  onConfirm: (cropped: File) => void;
  setSaving: (v: boolean) => void;
};

function CropperPanel({
  imageSrc,
  aspect,
  fileName,
  saving,
  onCancel,
  onConfirm,
  setSaving,
}: PanelProps) {
  const { t } = useTranslation();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const cropped = await createCroppedFile(
        imageSrc,
        croppedAreaPixels,
        fileName
      );
      onConfirm(cropped);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="relative h-100 w-full overflow-hidden rounded-lg bg-muted">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_a, areaPixels) => setCroppedAreaPixels(areaPixels)}
        />
      </div>
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-muted-foreground">
          {t("admin.imageCrop.zoom")}
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1"
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
          {t("common.cancel")}
        </Button>
        <Button
          size="sm"
          onClick={handleConfirm}
          disabled={saving || !croppedAreaPixels}
        >
          {saving ? t("admin.imageCrop.saving") : t("admin.imageCrop.confirm")}
        </Button>
      </div>
    </>
  );
}

export function ImageCropDialog({
  open,
  file,
  aspect,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);

  const imageSrc = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    if (!imageSrc) return;
    return () => URL.revokeObjectURL(imageSrc);
  }, [imageSrc]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("admin.imageCrop.title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t("admin.imageCrop.description")}
        </p>
        {imageSrc && file && (
          <CropperPanel
            key={imageSrc}
            imageSrc={imageSrc}
            aspect={aspect}
            fileName={file.name}
            saving={saving}
            setSaving={setSaving}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
