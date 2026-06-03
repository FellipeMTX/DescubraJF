import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "@/components/admin/ImageCropDialog";

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
  aspect: number;
  currentUrl?: string | null;
  label?: string;
};

export function ImageUploadField({
  value,
  onChange,
  aspect,
  currentUrl,
  label,
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = "";
  };

  const handleConfirm = (cropped: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(cropped));
    onChange(cropped);
    setPendingFile(null);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onChange(null);
  };

  const displayUrl = previewUrl ?? (value ? null : currentUrl);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="flex items-start gap-3">
        {displayUrl && (
          <div
            className="overflow-hidden rounded-md border bg-muted"
            style={{ aspectRatio: aspect, width: 120 }}
          >
            <img
              src={displayUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="mr-1.5 h-4 w-4" />
            {value || currentUrl
              ? t("admin.imageUpload.change")
              : t("admin.imageUpload.select")}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              <X className="mr-1.5 h-4 w-4" />
              {t("admin.imageUpload.clear")}
            </Button>
          )}
          {value && (
            <p className="text-xs text-muted-foreground">{value.name}</p>
          )}
        </div>
      </div>

      <ImageCropDialog
        open={pendingFile !== null}
        file={pendingFile}
        aspect={aspect}
        onConfirm={handleConfirm}
        onCancel={() => setPendingFile(null)}
      />
    </div>
  );
}
