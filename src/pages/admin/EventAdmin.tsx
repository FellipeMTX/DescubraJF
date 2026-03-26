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
import { useEvents } from "@/hooks/useEvents";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { slugify, formatDate } from "@/lib/utils";
import type { Evento } from "@/types/database";

type FormData = {
  titulo: string;
  descricao_curta: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local_nome: string;
  local_endereco: string;
  categoria: string;
  link_externo: string;
  gratuito: boolean;
  destaque: boolean;
};

const EMPTY: FormData = {
  titulo: "", descricao_curta: "", descricao: "", data_inicio: "", data_fim: "",
  local_nome: "", local_endereco: "", categoria: "", link_externo: "",
  gratuito: false, destaque: false,
};

const CATEGORIAS = ["cultural", "esportivo", "festivo", "show", "gastronomico"];

export default function EventAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Evento | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const qc = useQueryClient();
  const { data: items, isLoading } = useEvents();

  function openCreate() { setEditing(null); setForm(EMPTY); setImageFile(null); setDialogOpen(true); }

  function openEdit(item: Evento) {
    setEditing(item);
    setForm({
      titulo: item.titulo, descricao_curta: item.descricao_curta ?? "", descricao: item.descricao ?? "",
      data_inicio: item.data_inicio ? item.data_inicio.slice(0, 10) : "",
      data_fim: item.data_fim ? item.data_fim.slice(0, 10) : "",
      local_nome: item.local_nome ?? "", local_endereco: item.local_endereco ?? "",
      categoria: item.categoria ?? "", link_externo: item.link_externo ?? "",
      gratuito: item.gratuito, destaque: item.destaque,
    });
    setImageFile(null); setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.titulo.trim() || !form.data_inicio) return;
    setSaving(true);
    try {
      let imagem_destaque = editing?.imagem_destaque ?? null;
      if (imageFile) imagem_destaque = await uploadImage(imageFile, "eventos");

      const payload = {
        titulo: form.titulo, slug: slugify(form.titulo),
        descricao_curta: form.descricao_curta || null, descricao: form.descricao || null,
        data_inicio: form.data_inicio, data_fim: form.data_fim || null,
        local_nome: form.local_nome || null, local_endereco: form.local_endereco || null,
        categoria: form.categoria || null, link_externo: form.link_externo || null,
        gratuito: form.gratuito, destaque: form.destaque,
        imagem_destaque, updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("eventos").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("eventos").insert(payload);
        if (error) throw error;
      }

      await qc.invalidateQueries({ queryKey: ["eventos"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar. Verifique o console.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) { alert("Erro ao excluir."); return; }
    await qc.invalidateQueries({ queryKey: ["eventos"] });
  }

  function update(field: keyof FormData, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-sm text-gray-500">Gerencie a agenda de eventos da cidade</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80">
            <Plus size={16} /> Novo Evento
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Novo"} Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Título *"><Input value={form.titulo} onChange={(e) => update("titulo", e.target.value)} /></Field>
              <Field label="Descrição curta"><Input value={form.descricao_curta} onChange={(e) => update("descricao_curta", e.target.value)} /></Field>
              <Field label="Descrição completa"><Textarea value={form.descricao} onChange={(e) => update("descricao", e.target.value)} rows={3} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Data início *"><Input type="date" value={form.data_inicio} onChange={(e) => update("data_inicio", e.target.value)} /></Field>
                <Field label="Data fim (opcional)"><Input type="date" value={form.data_fim} onChange={(e) => update("data_fim", e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Local"><Input value={form.local_nome} onChange={(e) => update("local_nome", e.target.value)} placeholder="Ex: Cine-Theatro Central" /></Field>
                <Field label="Endereço do local"><Input value={form.local_endereco} onChange={(e) => update("local_endereco", e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Categoria">
                  <select value={form.categoria} onChange={(e) => update("categoria", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm capitalize">
                    <option value="">Selecione...</option>
                    {CATEGORIAS.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </Field>
                <Field label="Link externo"><Input value={form.link_externo} onChange={(e) => update("link_externo", e.target.value)} placeholder="https://..." /></Field>
              </div>
              <Field label="Imagem de capa"><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} /></Field>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.gratuito} onChange={(e) => update("gratuito", e.target.checked)} className="rounded border-gray-300" />
                  Gratuito
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.destaque} onChange={(e) => update("destaque", e.target.checked)} className="rounded border-gray-300" />
                  Destaque na Home
                </label>
              </div>
              <Button onClick={handleSave} disabled={saving || !form.titulo.trim() || !form.data_inicio} className="w-full">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Evento</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Data</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Local</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td className="px-4 py-3" colSpan={5}><Skeleton className="h-6 w-full" /></td></tr>
            )) : items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.imagem_destaque ? <img src={item.imagem_destaque} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">Sem foto</div>}
                    <div>
                      <p className="font-medium text-gray-900">{item.titulo}</p>
                      {item.categoria && <p className="text-xs capitalize text-gray-500">{item.categoria}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {formatDate(item.data_inicio)}
                  {item.data_fim && <span className="block text-gray-400">até {formatDate(item.data_fim)}</span>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{item.local_nome}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {item.gratuito && <Badge variant="secondary">Gratuito</Badge>}
                    {item.destaque && <Badge variant="secondary">Destaque</Badge>}
                  </div>
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
  return <div><label className="text-sm font-medium text-gray-700">{label}</label>{children}</div>;
}
