import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useRoutes } from "@/hooks/useRoutes";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { IMAGE_RATIOS_NUM } from "@/lib/constants";
import type { Roteiro } from "@/types/database";

type FormData = {
  nome: string;
  descricao: string;
  descricao_curta: string;
  mapa_url: string;
};

const EMPTY: FormData = { nome: "", descricao: "", descricao_curta: "", mapa_url: "" };

export default function RouteAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Roteiro | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const qc = useQueryClient();
  const { data: items, isLoading } = useRoutes();

  function openCreate() { setEditing(null); setForm(EMPTY); setImageFile(null); setDialogOpen(true); }

  function openEdit(item: Roteiro) {
    setEditing(item);
    setForm({
      nome: item.nome,
      descricao: item.descricao ?? "",
      descricao_curta: item.descricao_curta ?? "",
      mapa_url: item.mapa_url ?? "",
    });
    setImageFile(null); setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      let imagem_destaque = editing?.imagem_destaque ?? null;
      if (imageFile) imagem_destaque = await uploadImage(imageFile, "roteiros");

      const payload = {
        nome: form.nome,
        slug: slugify(form.nome),
        descricao: form.descricao || null,
        descricao_curta: form.descricao_curta || null,
        mapa_url: form.mapa_url || null,
        imagem_destaque,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("roteiros").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("roteiros").insert(payload);
        if (error) throw error;
      }

      await qc.invalidateQueries({ queryKey: ["roteiros"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar. Verifique o console.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este roteiro?")) return;
    const { error } = await supabase.from("roteiros").delete().eq("id", id);
    if (error) { alert("Erro ao excluir."); return; }
    await qc.invalidateQueries({ queryKey: ["roteiros"] });
  }

  function update(field: keyof FormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roteiros</h1>
          <p className="text-sm text-muted-foreground">Gerencie os caminhos temáticos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80">
            <Plus size={16} /> Novo Roteiro
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Novo"} Roteiro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Nome *"><Input value={form.nome} onChange={(e) => update("nome", e.target.value)} placeholder="Ex: Caminho das Compras" /></Field>
              <Field label="Descrição curta"><Input value={form.descricao_curta} onChange={(e) => update("descricao_curta", e.target.value)} placeholder="Texto para o card" /></Field>
              <Field label="Descrição completa"><Textarea value={form.descricao} onChange={(e) => update("descricao", e.target.value)} rows={3} /></Field>
              <Field label="Link do mapa (embed URL do Google Maps)">
                <Input value={form.mapa_url} onChange={(e) => update("mapa_url", e.target.value)} placeholder="https://www.google.com/maps/d/embed?mid=..." />
              </Field>
              <Field label="Imagem de capa">
                <ImageUploadField
                  value={imageFile}
                  onChange={setImageFile}
                  aspect={IMAGE_RATIOS_NUM.cardLandscape}
                  currentUrl={editing?.imagem_destaque}
                />
              </Field>
              <Button onClick={handleSave} disabled={saving || !form.nome.trim()} className="w-full">
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
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Roteiro</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mapa</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}><td className="px-4 py-3" colSpan={3}><Skeleton className="h-6 w-full" /></td></tr>
            )) : items?.map((item) => (
              <tr key={item.id} className="hover:bg-muted">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.imagem_destaque ? <img src={item.imagem_destaque} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">Sem foto</div>}
                    <div>
                      <p className="font-medium text-foreground">{item.nome}</p>
                      <p className="text-xs text-muted-foreground">{item.descricao_curta}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {item.mapa_url ? <span className="text-green-600">Configurado</span> : <span className="text-muted-foreground">Sem mapa</span>}
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
