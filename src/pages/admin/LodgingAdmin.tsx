import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { AddressSearch } from "@/components/ui/AddressSearch";
import { useLodgingEstablishments } from "@/hooks/useLodging";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import type { Hospedagem } from "@/types/database";

type FormData = {
  nome: string;
  descricao_curta: string;
  descricao: string;
  tipo: string;
  estrelas: string;
  endereco: string;
  bairro: string;
  latitude: string;
  longitude: string;
  faixa_preco: string;
  comodidades: string;
};

const EMPTY: FormData = {
  nome: "", descricao_curta: "", descricao: "", tipo: "hotel", estrelas: "3",
  endereco: "", bairro: "", latitude: "", longitude: "", faixa_preco: "2", comodidades: "",
};

export default function LodgingAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Hospedagem | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const qc = useQueryClient();
  const { data: items, isLoading } = useLodgingEstablishments();

  function openCreate() { setEditing(null); setForm(EMPTY); setImageFile(null); setDialogOpen(true); }

  function openEdit(item: Hospedagem) {
    setEditing(item);
    setForm({
      nome: item.nome, descricao_curta: item.descricao_curta ?? "", descricao: item.descricao ?? "",
      tipo: item.tipo, estrelas: item.estrelas?.toString() ?? "3", endereco: item.endereco ?? "",
      bairro: item.bairro ?? "", latitude: item.latitude?.toString() ?? "",
      longitude: item.longitude?.toString() ?? "", faixa_preco: item.faixa_preco?.toString() ?? "2",
      comodidades: item.comodidades?.join(", ") ?? "",
    });
    setImageFile(null); setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      let imagem_destaque = editing?.imagem_destaque ?? null;
      if (imageFile) imagem_destaque = await uploadImage(imageFile, "hospedagens");

      const comodidades = form.comodidades
        .split(",").map((c) => c.trim()).filter(Boolean);

      const payload = {
        nome: form.nome, slug: slugify(form.nome), descricao_curta: form.descricao_curta || null,
        descricao: form.descricao || null, tipo: form.tipo, estrelas: parseInt(form.estrelas) || null,
        endereco: form.endereco || null, bairro: form.bairro || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        faixa_preco: parseInt(form.faixa_preco) || 2,
        comodidades: comodidades.length > 0 ? comodidades : null,
        imagem_destaque, updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("hospedagens").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("hospedagens").insert(payload);
        if (error) throw error;
      }

      await qc.invalidateQueries({ queryKey: ["hospedagens"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar. Verifique o console.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const { error } = await supabase.from("hospedagens").delete().eq("id", id);
    if (error) { alert("Erro ao excluir."); return; }
    await qc.invalidateQueries({ queryKey: ["hospedagens"] });
  }

  function update(field: keyof FormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospedagens</h1>
          <p className="text-sm text-gray-500">Gerencie hotéis, pousadas, hostels e flats</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80">
            <Plus size={16} /> Nova Hospedagem
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Nova"} Hospedagem</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Nome *"><Input value={form.nome} onChange={(e) => update("nome", e.target.value)} /></Field>
              <Field label="Descrição curta"><Input value={form.descricao_curta} onChange={(e) => update("descricao_curta", e.target.value)} /></Field>
              <Field label="Descrição completa"><Textarea value={form.descricao} onChange={(e) => update("descricao", e.target.value)} rows={3} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tipo">
                  <select value={form.tipo} onChange={(e) => update("tipo", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option value="hotel">Hotel</option>
                    <option value="pousada">Pousada</option>
                    <option value="hostel">Hostel</option>
                    <option value="flat">Flat</option>
                  </select>
                </Field>
                <Field label="Estrelas">
                  <select value={form.estrelas} onChange={(e) => update("estrelas", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} estrela{n > 1 ? "s" : ""}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Foto principal"><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} /></Field>
              <AddressSearch onSelect={(data) => { update("endereco", data.endereco); update("bairro", data.bairro); update("latitude", data.latitude); update("longitude", data.longitude); }} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Endereço"><Input value={form.endereco} onChange={(e) => update("endereco", e.target.value)} /></Field>
                <Field label="Bairro"><Input value={form.bairro} onChange={(e) => update("bairro", e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Latitude"><Input value={form.latitude} readOnly className="bg-gray-50" /></Field>
                <Field label="Longitude"><Input value={form.longitude} readOnly className="bg-gray-50" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Faixa de preço">
                  <select value={form.faixa_preco} onChange={(e) => update("faixa_preco", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option value="1">$ Econômico</option>
                    <option value="2">$$ Moderado</option>
                    <option value="3">$$$ Premium</option>
                  </select>
                </Field>
              </div>
              <Field label="Comodidades (separadas por vírgula)">
                <Input value={form.comodidades} onChange={(e) => update("comodidades", e.target.value)} placeholder="wifi, estacionamento, piscina, café da manhã" />
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
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Estrelas</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td className="px-4 py-3" colSpan={4}><Skeleton className="h-6 w-full" /></td></tr>
            )) : items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.imagem_destaque ? <img src={item.imagem_destaque} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">Sem foto</div>}
                    <div><p className="font-medium text-gray-900">{item.nome}</p><p className="text-xs text-gray-500">{item.endereco}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="secondary" className="capitalize">{item.tipo}</Badge></td>
                <td className="px-4 py-3">
                  {item.estrelas && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: item.estrelas }).map((_, s) => (
                        <Star key={s} size={12} className="fill-primary-400 text-primary-400" />
                      ))}
                    </div>
                  )}
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
