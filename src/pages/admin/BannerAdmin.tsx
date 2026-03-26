import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import type { Banner } from "@/types/database";

type BannerForm = {
  titulo: string;
  subtitulo: string;
  link: string;
  ordem: number;
};

const EMPTY_FORM: BannerForm = {
  titulo: "",
  subtitulo: "",
  link: "",
  ordem: 0,
};

export default function BannerAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("ordem");
      if (error) throw error;
      return data as Banner[];
    },
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, ordem: (banners?.length ?? 0) + 1 });
    setImageFile(null);
    setDialogOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditing(banner);
    setForm({
      titulo: banner.titulo,
      subtitulo: banner.subtitulo ?? "",
      link: banner.link ?? "",
      ordem: banner.ordem,
    });
    setImageFile(null);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.titulo.trim()) return;
    if (!editing && !imageFile) {
      alert("Selecione uma imagem para o banner.");
      return;
    }
    setSaving(true);

    try {
      let imagem_url = editing?.imagem_url ?? "";
      if (imageFile) {
        imagem_url = await uploadImage(imageFile, "banners");
      }

      const payload = {
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        link: form.link || null,
        imagem_url,
        ordem: form.ordem,
        ativo: true,
      };

      if (editing) {
        await supabase.from("banners").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("banners").insert(payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      await queryClient.invalidateQueries({ queryKey: ["banners"] });
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;
    await supabase.from("banners").delete().eq("id", id);
    await queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
    await queryClient.invalidateQueries({ queryKey: ["banners"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500">
            Gerencie o banner rotativo da página inicial
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            <Plus size={16} /> Novo Banner
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Banner" : "Novo Banner"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Título *</label>
                <Input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Museu Mariano Procópio"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subtítulo</label>
                <Input
                  value={form.subtitulo}
                  onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                  placeholder="Texto secundário"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Link (destino do botão "Saiba mais")</label>
                <Input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/experiencias/museu-mariano-procopio"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Imagem {editing ? "(deixe vazio para manter)" : "*"}
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ordem</label>
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button onClick={handleSave} disabled={saving || !form.titulo.trim()} className="w-full">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner list */}
      <div className="mt-6 space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          : banners?.map((banner) => (
              <div
                key={banner.id}
                className="flex items-center gap-4 rounded-lg border bg-white p-4"
              >
                <GripVertical size={16} className="text-gray-300" />

                {banner.imagem_url && !banner.imagem_url.startsWith("/") ? (
                  <img
                    src={banner.imagem_url}
                    alt={banner.titulo}
                    className="h-16 w-28 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-28 items-center justify-center rounded bg-primary-100 text-xs text-primary-400">
                    Placeholder
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{banner.titulo}</p>
                  {banner.subtitulo && (
                    <p className="text-sm text-gray-500">{banner.subtitulo}</p>
                  )}
                  {banner.link && (
                    <p className="text-xs text-primary-500">{banner.link}</p>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(banner)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(banner.id)}>
                    <Trash2 size={14} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
