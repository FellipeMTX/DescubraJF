import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { uniqueSlug } from "@/lib/slug";
import { IMAGE_RATIOS_NUM } from "@/lib/constants";
import type { Post, PostCategoria } from "@/types/database";

type FormData = {
  titulo: string;
  resumo: string;
  conteudo_html: string;
  autor: string;
  publicado: boolean;
  /** YYYY-MM-DD ou "" quando vazio (usa created_at como fallback). */
  data_publicacao: string;
};

const EMPTY: FormData = {
  titulo: "", resumo: "", conteudo_html: "", autor: "", publicado: false, data_publicacao: "",
};

function isoToDateInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

function dateInputToIso(date: string): string | null {
  if (!date) return null;
  // noon UTC pra evitar deslocamento de timezone que mude o dia
  return `${date}T12:00:00.000Z`;
}

const LABELS: Record<PostCategoria, { title: string; subtitle: string; singular: string }> = {
  noticia: {
    title: "Notícias",
    subtitle: "Gerencie as notícias publicadas",
    singular: "Notícia",
  },
  programa_projeto: {
    title: "Programas e Projetos",
    subtitle: "Gerencie os programas e projetos publicados",
    singular: "Programa/Projeto",
  },
};

type Props = { categoria: PostCategoria };

export default function PostsAdmin({ categoria }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const qc = useQueryClient();
  const { data: items, isLoading } = usePosts(categoria, false);
  const labels = LABELS[categoria];

  function openCreate() {
    setEditing(null); setForm(EMPTY); setImageFile(null); setDialogOpen(true);
  }

  function openEdit(item: Post) {
    setEditing(item);
    setForm({
      titulo: item.titulo,
      resumo: item.resumo ?? "",
      conteudo_html: item.conteudo_html ?? "",
      autor: item.autor ?? "",
      publicado: item.publicado,
      data_publicacao: isoToDateInput(item.data_publicacao),
    });
    setImageFile(null); setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.titulo.trim()) return;
    setSaving(true);
    try {
      let imagem_capa = editing?.imagem_capa ?? null;
      if (imageFile) imagem_capa = await uploadImage(imageFile, "posts");

      const payload = {
        categoria,
        titulo: form.titulo,
        slug: await uniqueSlug(form.titulo, "posts", editing?.id),
        resumo: form.resumo || null,
        conteudo_html: form.conteudo_html || null,
        autor: form.autor || null,
        publicado: form.publicado,
        data_publicacao: dateInputToIso(form.data_publicacao),
        imagem_capa,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("posts").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }

      await qc.invalidateQueries({ queryKey: ["posts", categoria] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) { alert("Erro ao excluir."); return; }
    await qc.invalidateQueries({ queryKey: ["posts", categoria] });
  }

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{labels.title}</h1>
          <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            <Plus size={16} /> Novo
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto sm:max-w-5xl!">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Novo"} {labels.singular}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Título *">
                <Input value={form.titulo} onChange={(e) => update("titulo", e.target.value)} />
              </Field>
              <Field label="Resumo (aparece na listagem)">
                <Textarea value={form.resumo} onChange={(e) => update("resumo", e.target.value)} rows={2} />
              </Field>
              <Field label="Autor">
                <Input value={form.autor} onChange={(e) => update("autor", e.target.value)} />
              </Field>
              <Field label="Data de publicação (opcional)">
                <Input
                  type="date"
                  value={form.data_publicacao}
                  onChange={(e) => update("data_publicacao", e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Se vazio, usa a data de criação do registro.
                </p>
              </Field>
              <Field label="Imagem de capa">
                <ImageUploadField
                  value={imageFile}
                  onChange={setImageFile}
                  aspect={IMAGE_RATIOS_NUM.postCover}
                  currentUrl={editing?.imagem_capa}
                />
              </Field>
              <Field label="Conteúdo">
                <RichTextEditor
                  value={form.conteudo_html}
                  onChange={(html) => update("conteudo_html", html)}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.publicado}
                  onChange={(e) => update("publicado", e.target.checked)}
                  className="rounded border-input"
                />
                Publicado (visível no site)
              </label>
              <Button
                onClick={handleSave}
                disabled={saving || !form.titulo.trim()}
                className="w-full"
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Título</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Autor</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td className="px-4 py-3" colSpan={5}><Skeleton className="h-6 w-full" /></td></tr>
            )) : items?.map((item) => (
              <tr key={item.id} className="hover:bg-muted">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.imagem_capa ? (
                      <img src={item.imagem_capa} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">Sem foto</div>
                    )}
                    <p className="font-medium text-foreground">{item.titulo}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{item.autor ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(item.data_publicacao ?? item.created_at)}</td>
                <td className="px-4 py-3">
                  {item.publicado
                    ? <Badge variant="secondary">Publicado</Badge>
                    : <Badge variant="outline">Rascunho</Badge>}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}><Pencil size={14} /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} className="text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-sm font-medium text-foreground">{label}</label>{children}</div>;
}
