import { useRef, useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/storage";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
};

export function GalleryUploader({ value, onChange, folder = "posts/galeria" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        urls.push(await uploadImage(file, folder));
      }
      onChange([...value, ...urls]);
    } catch (err) {
      console.error("Erro ao enviar imagens:", err);
      alert("Erro ao enviar imagens.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-md border border-dashed border-input bg-muted/30 p-3">
      {value.length > 0 && (
        <div className="gallery-grid mb-3 grid grid-cols-3 gap-2 md:grid-cols-4">
          {value.map((src, i) => (
            <div key={`${src}-${i}`} className="group relative aspect-square overflow-hidden rounded-md bg-muted">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                aria-label="Remover"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <><Loader2 size={14} className="animate-spin" /> Enviando...</>
        ) : (
          <><Plus size={14} /> Adicionar fotos</>
        )}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}
