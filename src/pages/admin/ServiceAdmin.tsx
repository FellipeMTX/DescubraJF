import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { IconPicker, getIconByName } from "@/components/ui/IconPicker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useAllServiceCategories, useServices } from "@/hooks/useServices";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import type { CategoriaServico, Servico } from "@/types/database";

type Tab = "servicos" | "passeios";

// ─── Category Form ───
type CatFormData = { nome: string; descricao: string; icone: string; pagina: Tab };
const EMPTY_CAT: CatFormData = { nome: "", descricao: "", icone: "", pagina: "servicos" };

// ─── Item Form ───
type ItemFormData = {
  nome: string; descricao_curta: string; descricao: string;
  categoria_id: string; pagina: Tab; endereco: string; bairro: string;
  telefone: string; email: string; site: string; instagram: string; link_externo: string;
};
const EMPTY_ITEM: ItemFormData = {
  nome: "", descricao_curta: "", descricao: "", categoria_id: "", pagina: "servicos",
  endereco: "", bairro: "", telefone: "", email: "", site: "", instagram: "", link_externo: "",
};

export default function ServiceAdmin({ tab = "servicos" }: { tab?: Tab }) {
  const title = tab === "servicos" ? "Serviços" : "Passeios";
  const subtitle = tab === "servicos"
    ? "Gerencie os serviços disponíveis"
    : "Gerencie os passeios — \"A gente se vê por aí\"";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500">{subtitle}</p>

      <div className="mt-6 space-y-8">
        <CategorySection tab={tab} />
        <ItemSection tab={tab} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// Categories
// ═══════════════════════════════════
function CategorySection({ tab }: { tab: Tab }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoriaServico | null>(null);
  const [form, setForm] = useState<CatFormData>(EMPTY_CAT);
  const [saving, setSaving] = useState(false);

  const qc = useQueryClient();
  const { data: allCategories, isLoading } = useAllServiceCategories();
  const categories = allCategories?.filter((c) => c.pagina === tab);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_CAT, pagina: tab });
    setDialogOpen(true);
  }

  function openEdit(cat: CategoriaServico) {
    setEditing(cat);
    setForm({ nome: cat.nome, descricao: cat.descricao ?? "", icone: cat.icone ?? "", pagina: cat.pagina });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      const payload = {
        nome: form.nome, slug: slugify(form.nome), descricao: form.descricao || null,
        icone: form.icone || null, pagina: form.pagina,
      };
      if (editing) {
        const { error } = await supabase.from("categorias_servicos").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categorias_servicos").insert(payload);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["categorias_servicos"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      alert("Erro ao salvar categoria.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir categoria?")) return;
    const { error } = await supabase.from("categorias_servicos").delete().eq("id", id);
    if (error) { alert("Erro ao excluir."); return; }
    await qc.invalidateQueries({ queryKey: ["categorias_servicos"] });
  }

  function update(field: keyof CatFormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Categorias</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80">
            <Plus size={16} /> Nova Categoria
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Nova"} Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Nome *"><Input value={form.nome} onChange={(e) => update("nome", e.target.value)} /></Field>
              <Field label="Descrição"><Input value={form.descricao} onChange={(e) => update("descricao", e.target.value)} placeholder="Breve descrição da categoria" /></Field>
              <IconPicker value={form.icone} onChange={(name) => update("icone", name)} />
              <Button onClick={handleSave} disabled={saving || !form.nome.trim()} className="w-full">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {isLoading ? (
          <Skeleton className="h-8 w-48" />
        ) : categories?.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma categoria cadastrada.</p>
        ) : categories?.map((cat) => (
          <div key={cat.id} className="flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm">
            {(() => { const Icon = getIconByName(cat.icone); return Icon ? <Icon size={14} className="mr-1" /> : null; })()}
            <span className="font-medium text-gray-700">{cat.nome}</span>
            <button onClick={() => openEdit(cat)} className="ml-1 text-gray-400 hover:text-gray-600"><Pencil size={12} /></button>
            <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// Items
// ═══════════════════════════════════
function ItemSection({ tab }: { tab: Tab }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState<ItemFormData>(EMPTY_ITEM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const qc = useQueryClient();
  const { data: items, isLoading } = useServices(tab);
  const { data: allCategories } = useAllServiceCategories();
  const categories = allCategories?.filter((c) => c.pagina === tab);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_ITEM, pagina: tab });
    setImageFile(null);
    setDialogOpen(true);
  }

  function openEdit(item: Servico) {
    setEditing(item);
    setForm({
      nome: item.nome, descricao_curta: item.descricao_curta ?? "", descricao: item.descricao ?? "",
      categoria_id: item.categoria_id ?? "", pagina: item.pagina, endereco: item.endereco ?? "",
      bairro: item.bairro ?? "", telefone: item.contato?.telefone ?? "", email: item.contato?.email ?? "",
      site: item.contato?.site ?? "", instagram: item.contato?.instagram ?? "",
      link_externo: item.link_externo ?? "",
    });
    setImageFile(null);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      let imagem_destaque = editing?.imagem_destaque ?? null;
      if (imageFile) imagem_destaque = await uploadImage(imageFile, "servicos");

      const contato = {
        telefone: form.telefone || undefined, email: form.email || undefined,
        site: form.site || undefined, instagram: form.instagram || undefined,
      };
      const hasContato = Object.values(contato).some(Boolean);

      const payload = {
        nome: form.nome, slug: slugify(form.nome), descricao_curta: form.descricao_curta || null,
        descricao: form.descricao || null, categoria_id: form.categoria_id || null,
        pagina: form.pagina, endereco: form.endereco || null, bairro: form.bairro || null,
        contato: hasContato ? contato : null, link_externo: form.link_externo || null,
        imagem_destaque, updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("servicos").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("servicos").insert(payload);
        if (error) throw error;
      }

      await qc.invalidateQueries({ queryKey: ["servicos"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar. Verifique o console.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir item?")) return;
    const { error } = await supabase.from("servicos").delete().eq("id", id);
    if (error) { alert("Erro ao excluir."); return; }
    await qc.invalidateQueries({ queryKey: ["servicos"] });
  }

  function update(field: keyof ItemFormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {tab === "servicos" ? "Serviços" : "Passeios"}
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80">
            <Plus size={16} /> Novo Item
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Novo"} Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Nome *"><Input value={form.nome} onChange={(e) => update("nome", e.target.value)} /></Field>
              <Field label="Descrição curta"><Input value={form.descricao_curta} onChange={(e) => update("descricao_curta", e.target.value)} /></Field>
              <Field label="Descrição completa"><Textarea value={form.descricao} onChange={(e) => update("descricao", e.target.value)} rows={3} /></Field>
              <Field label="Categoria">
                <select value={form.categoria_id} onChange={(e) => update("categoria_id", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="">Selecione...</option>
                  {categories?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </Field>
              <Field label="Foto"><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Endereço"><Input value={form.endereco} onChange={(e) => update("endereco", e.target.value)} /></Field>
                <Field label="Bairro"><Input value={form.bairro} onChange={(e) => update("bairro", e.target.value)} /></Field>
              </div>
              <Field label="Link externo"><Input value={form.link_externo} onChange={(e) => update("link_externo", e.target.value)} placeholder="https://..." /></Field>
              <h3 className="text-sm font-semibold text-gray-800">Contato</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Telefone"><Input value={form.telefone} onChange={(e) => update("telefone", e.target.value)} /></Field>
                <Field label="Email"><Input value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Site"><Input value={form.site} onChange={(e) => update("site", e.target.value)} /></Field>
                <Field label="Instagram"><Input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} /></Field>
              </div>
              <Button onClick={handleSave} disabled={saving || !form.nome.trim()} className="w-full">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Categoria</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td className="px-4 py-3" colSpan={3}><Skeleton className="h-6 w-full" /></td></tr>
            )) : items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.imagem_destaque
                      ? <img src={item.imagem_destaque} alt="" className="h-10 w-10 rounded object-cover" />
                      : <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">Sem foto</div>}
                    <div>
                      <p className="font-medium text-gray-900">{item.nome}</p>
                      <p className="text-xs text-gray-500">{item.endereco}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {item.categoria && <Badge variant="secondary">{item.categoria.nome}</Badge>}
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
