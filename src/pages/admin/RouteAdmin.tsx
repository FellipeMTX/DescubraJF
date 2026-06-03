import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Field } from "@/components/admin/roteiro/fields";
import { RoteiroLayoutFields } from "@/components/admin/roteiro/RoteiroLayoutFields";
import { RoteiroPontosFields } from "@/components/admin/roteiro/RoteiroPontosFields";
import { EMPTY_LAYOUT, type PontoDraft } from "@/components/admin/roteiro/defaults";
import { useRoutes } from "@/hooks/useRoutes";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { uniqueSlug } from "@/lib/slug";
import { IMAGE_RATIOS_NUM } from "@/lib/constants";
import type { Roteiro, RoteiroLayout } from "@/types/database";

type FormData = {
  nome: string;
  descricao_curta: string;
  mapa_url: string;
  ativo: boolean;
  destaque: boolean;
  ordem: number;
};

const EMPTY: FormData = { nome: "", descricao_curta: "", mapa_url: "", ativo: true, destaque: false, ordem: 0 };

function withDefaults(l: Partial<RoteiroLayout> | null): RoteiroLayout {
  const e = EMPTY_LAYOUT;
  return {
    hero: { ...e.hero, ...(l?.hero ?? {}) },
    stats: l?.stats ? [...l.stats] : [],
    sobre: {
      ...e.sobre,
      ...(l?.sobre ?? {}),
      paragrafos: l?.sobre?.paragrafos ? [...l.sobre.paragrafos] : [],
      card: {
        ...e.sobre.card,
        ...(l?.sobre?.card ?? {}),
        bullets: l?.sobre?.card?.bullets ? [...l.sobre.card.bullets] : [],
      },
    },
    destaquesTitulo: l?.destaquesTitulo ?? e.destaquesTitulo,
    dicas: { ...e.dicas, ...(l?.dicas ?? {}), items: l?.dicas?.items ? [...l.dicas.items] : [] },
    mapsLink: l?.mapsLink ?? "",
    bottomCta: { ...e.bottomCta, ...(l?.bottomCta ?? {}) },
  };
}

export default function RouteAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Roteiro | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [layout, setLayout] = useState<RoteiroLayout>(withDefaults(null));
  const [pontos, setPontos] = useState<PontoDraft[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const qc = useQueryClient();
  const { data: items, isLoading } = useRoutes();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setLayout(withDefaults(null));
    setPontos([]);
    setImageFile(null);
    setDialogOpen(true);
  }

  async function openEdit(item: Roteiro) {
    setEditing(item);
    setForm({
      nome: item.nome,
      descricao_curta: item.descricao_curta ?? "",
      mapa_url: item.mapa_url ?? "",
      ativo: item.ativo,
      destaque: item.destaque,
      ordem: item.ordem,
    });
    setLayout(withDefaults(item.layout));
    setImageFile(null);
    setPontos([]);
    setDialogOpen(true);

    const { data } = await supabase
      .from("roteiro_pontos")
      .select("*")
      .eq("roteiro_id", item.id)
      .order("ordem");
    setPontos(
      (data ?? []).map((p) => ({
        id: p.id,
        nome: p.nome,
        descricao: p.descricao ?? "",
        local: p.local ?? "",
        imagem: p.imagem ?? null,
        file: null,
      })),
    );
  }

  async function handleSave() {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      let imagem_destaque = editing?.imagem_destaque ?? null;
      if (imageFile) imagem_destaque = await uploadImage(imageFile, "roteiros");

      const payload = {
        nome: form.nome,
        slug: await uniqueSlug(form.nome, "roteiros", editing?.id),
        descricao_curta: form.descricao_curta || null,
        descricao: layout.hero.descricao || null,
        mapa_url: form.mapa_url || null,
        layout,
        imagem_destaque,
        ativo: form.ativo,
        destaque: form.destaque,
        ordem: form.ordem,
        updated_at: new Date().toISOString(),
      };

      let roteiroId = editing?.id;
      if (editing) {
        const { error } = await supabase.from("roteiros").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("roteiros").insert(payload).select("id").single();
        if (error) throw error;
        roteiroId = data.id;
      }
      if (!roteiroId) throw new Error("Sem id do roteiro");

      const pontoRows = [];
      for (let i = 0; i < pontos.length; i++) {
        const d = pontos[i];
        if (!d.nome.trim()) continue;
        let imagem = d.imagem;
        if (d.file) imagem = await uploadImage(d.file, "roteiros");
        pontoRows.push({
          roteiro_id: roteiroId,
          nome: d.nome,
          descricao: d.descricao || null,
          local: d.local || null,
          imagem,
          ordem: i,
        });
      }
      await supabase.from("roteiro_pontos").delete().eq("roteiro_id", roteiroId);
      if (pontoRows.length) {
        const { error } = await supabase.from("roteiro_pontos").insert(pontoRows);
        if (error) throw error;
      }

      await qc.invalidateQueries({ queryKey: ["roteiros"] });
      await qc.invalidateQueries({ queryKey: ["roteiro"] });
      await qc.invalidateQueries({ queryKey: ["roteiro_pontos"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este roteiro?")) return;
    const { error } = await supabase.from("roteiros").delete().eq("id", id);
    if (error) { alert("Erro ao excluir."); return; }
    await qc.invalidateQueries({ queryKey: ["roteiros"] });
  }

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
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
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Novo"} Roteiro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl border bg-background p-4">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">Geral</h3>
                <div className="space-y-3">
                  <Field label="Nome *">
                    <Input value={form.nome} onChange={(e) => update("nome", e.target.value)} placeholder="Ex: Caminho das Compras" />
                  </Field>
                  <Field label="Descrição curta" hint="Texto exibido no card da listagem">
                    <Input value={form.descricao_curta} onChange={(e) => update("descricao_curta", e.target.value)} />
                  </Field>
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
                  <div className="flex flex-wrap items-center gap-5">
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" checked={form.ativo} onChange={(e) => update("ativo", e.target.checked)} /> Ativo
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" checked={form.destaque} onChange={(e) => update("destaque", e.target.checked)} /> Destaque
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      Ordem
                      <Input type="number" className="w-20" value={form.ordem} onChange={(e) => update("ordem", Number(e.target.value))} />
                    </label>
                  </div>
                </div>
              </div>

              <RoteiroLayoutFields value={layout} onChange={setLayout} />
              <RoteiroPontosFields items={pontos} onChange={setPontos} />

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
