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
import { AddressSearch } from "@/components/ui/AddressSearch";
import { MapPreview } from "@/components/ui/MapPreview";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { cn } from "@/lib/utils";
import { useDiningEstablishments, useDiningCategories } from "@/hooks/useDining";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import type { EstabelecimentoGastronomia } from "@/types/database";

type FormData = {
  nome: string;
  descricao_curta: string;
  descricao: string;
  categoria_ids: string[];
  endereco: string;
  numero: string;
  bairro: string;
  latitude: string;
  longitude: string;
  faixa_preco: string;
  estacionamento: boolean;
};

const EMPTY: FormData = {
  nome: "", descricao_curta: "", descricao: "", categoria_ids: [],
  endereco: "", numero: "", bairro: "", latitude: "", longitude: "", faixa_preco: "1", estacionamento: false,
};

export default function DiningAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EstabelecimentoGastronomia | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const qc = useQueryClient();
  const { data: items, isLoading } = useDiningEstablishments();
  const { data: categories } = useDiningCategories();

  function openCreate() { setEditing(null); setForm(EMPTY); setImageFile(null); setDialogOpen(true); }

  function openEdit(item: EstabelecimentoGastronomia) {
    setEditing(item);
    setForm({
      nome: item.nome, descricao_curta: item.descricao_curta ?? "", descricao: item.descricao ?? "",
      categoria_ids: item.categorias?.map((c) => c.id) ?? [], endereco: item.endereco ?? "",
      numero: "", bairro: item.bairro ?? "", latitude: item.latitude?.toString() ?? "",
      longitude: item.longitude?.toString() ?? "", faixa_preco: item.faixa_preco?.toString() ?? "1",
      estacionamento: item.estacionamento,
    });
    setImageFile(null); setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      let imagem_destaque = editing?.imagem_destaque ?? null;
      if (imageFile) imagem_destaque = await uploadImage(imageFile, "gastronomia");

      const payload = {
        nome: form.nome, slug: slugify(form.nome), descricao_curta: form.descricao_curta || null,
        descricao: form.descricao || null,
        endereco: [form.endereco, form.numero].filter(Boolean).join(", ") || null, bairro: form.bairro || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        faixa_preco: parseInt(form.faixa_preco) || 1, estacionamento: form.estacionamento,
        imagem_destaque, updated_at: new Date().toISOString(),
      };

      let estabelecimentoId: string;

      if (editing) {
        const { error } = await supabase.from("estabelecimentos_gastronomia").update(payload).eq("id", editing.id);
        if (error) throw error;
        estabelecimentoId = editing.id;
      } else {
        const { data, error } = await supabase.from("estabelecimentos_gastronomia").insert(payload).select("id").single();
        if (error) throw error;
        estabelecimentoId = data.id;
      }

      // Update categories via junction table
      await supabase.from("estabelecimento_categorias").delete().eq("estabelecimento_id", estabelecimentoId);
      if (form.categoria_ids.length > 0) {
        const rows = form.categoria_ids.map((catId) => ({ estabelecimento_id: estabelecimentoId, categoria_id: catId }));
        await supabase.from("estabelecimento_categorias").insert(rows);
      }

      await qc.invalidateQueries({ queryKey: ["gastronomia"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar. Verifique o console.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const { error } = await supabase.from("estabelecimentos_gastronomia").delete().eq("id", id);
    if (error) { alert("Erro ao excluir."); return; }
    await qc.invalidateQueries({ queryKey: ["gastronomia"] });
  }

  function update(field: keyof FormData, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gastronomia</h1>
          <p className="text-sm text-gray-500">Gerencie restaurantes, bares e cafés</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80">
            <Plus size={16} /> Novo Estabelecimento
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Novo"} Estabelecimento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Nome *"><Input value={form.nome} onChange={(e) => update("nome", e.target.value)} /></Field>
              <Field label="Descrição curta"><Input value={form.descricao_curta} onChange={(e) => update("descricao_curta", e.target.value)} /></Field>
              <Field label="Descrição completa"><Textarea value={form.descricao} onChange={(e) => update("descricao", e.target.value)} rows={3} /></Field>
              <Field label="Categorias">
                <div className="mt-1 flex flex-wrap gap-2">
                  {categories?.map((c) => (
                    <label key={c.id} className={cn(
                      "cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors",
                      form.categoria_ids.includes(c.id)
                        ? "border-primary-400 bg-primary-400 text-white"
                        : "border-gray-300 text-gray-600 hover:border-primary-300"
                    )}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={form.categoria_ids.includes(c.id)}
                        onChange={(e) => {
                          const ids = e.target.checked
                            ? [...form.categoria_ids, c.id]
                            : form.categoria_ids.filter((id) => id !== c.id);
                          setForm((p) => ({ ...p, categoria_ids: ids }));
                        }}
                      />
                      {c.nome}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Foto principal"><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} /></Field>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800">Localização</h3>
                <InfoTooltip text="Use a ferramenta de buscar endereço para facilitar a busca. Caso não seja encontrado, digite o endereço manualmente e busque sua geolocalização no Google Maps." />
              </div>
              <div className="flex gap-2">
                <AddressSearch onSelect={(data) => { update("endereco", data.endereco); update("bairro", data.bairro); update("latitude", data.latitude); update("longitude", data.longitude); }} />
                <MapPreview latitude={form.latitude} longitude={form.longitude} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2"><Field label="Endereço"><Input value={form.endereco} onChange={(e) => update("endereco", e.target.value)} /></Field></div>
                <Field label="Número"><Input value={form.numero} onChange={(e) => update("numero", e.target.value)} placeholder="123" /></Field>
              </div>
              <Field label="Bairro"><Input value={form.bairro} onChange={(e) => update("bairro", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Latitude"><Input value={form.latitude} onChange={(e) => update("latitude", e.target.value)} placeholder="-21.7469" /></Field>
                <Field label="Longitude"><Input value={form.longitude} onChange={(e) => update("longitude", e.target.value)} placeholder="-43.3560" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Faixa de preço">
                  <select value={form.faixa_preco} onChange={(e) => update("faixa_preco", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option value="1">$ Econômico</option>
                    <option value="2">$$ Moderado</option>
                    <option value="3">$$$ Premium</option>
                  </select>
                </Field>
                <label className="flex items-center gap-2 pt-6 text-sm">
                  <input type="checkbox" checked={form.estacionamento} onChange={(e) => update("estacionamento", e.target.checked)} className="rounded border-gray-300" />
                  Estacionamento
                </label>
              </div>
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
              <th className="px-4 py-3 text-left font-medium text-gray-500">Categoria</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Bairro</th>
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
                <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{item.categorias?.map((c) => <Badge key={c.id} variant="secondary">{c.nome}</Badge>)}</div></td>
                <td className="px-4 py-3 text-gray-500">{item.bairro}</td>
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
