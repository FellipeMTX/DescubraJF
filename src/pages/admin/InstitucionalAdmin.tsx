import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSeturEquipe, useSeturPagina } from "@/hooks/useSetur";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import type { SeturMembro, SeturPagina } from "@/types/database";

type PageForm = {
  hero_titulo: string;
  hero_subtitulo: string;
  intro_texto_1: string;
  intro_texto_2: string;
  intro_titulo_secao: string;
  intro_texto_3: string;
  missao_texto: string;
  visao_texto: string;
  valores: string;
  endereco: string;
  cep: string;
  latitude: string;
  longitude: string;
  horario: string;
  telefone: string;
  email: string;
};

function pageToForm(p: SeturPagina): PageForm {
  return {
    hero_titulo: p.hero_titulo,
    hero_subtitulo: p.hero_subtitulo ?? "",
    intro_texto_1: p.intro_texto_1 ?? "",
    intro_texto_2: p.intro_texto_2 ?? "",
    intro_titulo_secao: p.intro_titulo_secao ?? "",
    intro_texto_3: p.intro_texto_3 ?? "",
    missao_texto: p.missao_texto ?? "",
    visao_texto: p.visao_texto ?? "",
    valores: (p.valores ?? []).join("\n"),
    endereco: p.endereco ?? "",
    cep: p.cep ?? "",
    latitude: p.latitude?.toString() ?? "",
    longitude: p.longitude?.toString() ?? "",
    horario: p.horario ?? "",
    telefone: p.telefone ?? "",
    email: p.email ?? "",
  };
}

export default function InstitucionalAdmin() {
  const queryClient = useQueryClient();
  const { data: pagina, isLoading } = useSeturPagina();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Institucional</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie o conteúdo da página da Secretaria de Turismo.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : pagina ? (
        <PageSection pagina={pagina} queryClient={queryClient} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum registro encontrado. Rode <code>supabase/setur.sql</code> primeiro.
        </p>
      )}

      <TeamSection />
    </div>
  );
}

function PageSection({
  pagina,
  queryClient,
}: {
  pagina: SeturPagina;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const [form, setForm] = useState<PageForm>(() => pageToForm(pagina));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(pageToForm(pagina));
  }, [pagina]);

  function update<K extends keyof PageForm>(field: K, value: PageForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      let hero_imagem = pagina.hero_imagem;
      if (imageFile) {
        hero_imagem = await uploadImage(imageFile, "institucional");
      }

      const payload = {
        hero_imagem,
        hero_titulo: form.hero_titulo,
        hero_subtitulo: form.hero_subtitulo || null,
        intro_texto_1: form.intro_texto_1 || null,
        intro_texto_2: form.intro_texto_2 || null,
        intro_titulo_secao: form.intro_titulo_secao || null,
        intro_texto_3: form.intro_texto_3 || null,
        missao_texto: form.missao_texto || null,
        visao_texto: form.visao_texto || null,
        valores: form.valores
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean),
        endereco: form.endereco || null,
        cep: form.cep || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        horario: form.horario || null,
        telefone: form.telefone || null,
        email: form.email || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("setur_pagina")
        .update(payload)
        .eq("id", pagina.id);
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["setur_pagina"] });
      setImageFile(null);
      alert("Conteúdo salvo.");
    } catch (err) {
      console.error("Erro ao salvar página institucional:", err);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Conteúdo da Página</h2>

      <div className="space-y-6">
        <Fieldset title="Hero">
          <Field label="Título *">
            <Input value={form.hero_titulo} onChange={(e) => update("hero_titulo", e.target.value)} />
          </Field>
          <Field label="Subtítulo">
            <Input value={form.hero_subtitulo} onChange={(e) => update("hero_subtitulo", e.target.value)} />
          </Field>
          <Field label="Imagem de fundo">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            {imageFile ? (
              <p className="mt-1 text-xs text-muted-foreground">{imageFile.name}</p>
            ) : pagina.hero_imagem ? (
              <p className="mt-1 text-xs text-muted-foreground">Atual: {pagina.hero_imagem}</p>
            ) : null}
          </Field>
        </Fieldset>

        <Fieldset title="Introdução">
          <Field label="Parágrafo 1">
            <Textarea rows={4} value={form.intro_texto_1} onChange={(e) => update("intro_texto_1", e.target.value)} />
          </Field>
          <Field label="Parágrafo 2">
            <Textarea rows={3} value={form.intro_texto_2} onChange={(e) => update("intro_texto_2", e.target.value)} />
          </Field>
          <Field label="Título da seção (ex: O que fazemos?)">
            <Input value={form.intro_titulo_secao} onChange={(e) => update("intro_titulo_secao", e.target.value)} />
          </Field>
          <Field label="Parágrafo 3">
            <Textarea rows={3} value={form.intro_texto_3} onChange={(e) => update("intro_texto_3", e.target.value)} />
          </Field>
        </Fieldset>

        <Fieldset title="Missão / Visão / Valores">
          <Field label="Missão">
            <Textarea rows={3} value={form.missao_texto} onChange={(e) => update("missao_texto", e.target.value)} />
          </Field>
          <Field label="Visão">
            <Textarea rows={3} value={form.visao_texto} onChange={(e) => update("visao_texto", e.target.value)} />
          </Field>
          <Field label="Valores (um por linha)">
            <Textarea rows={5} value={form.valores} onChange={(e) => update("valores", e.target.value)} />
          </Field>
        </Fieldset>

        <Fieldset title="Localização e Contato">
          <Field label="Endereço">
            <Input value={form.endereco} onChange={(e) => update("endereco", e.target.value)} />
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="CEP">
              <Input value={form.cep} onChange={(e) => update("cep", e.target.value)} />
            </Field>
            <Field label="Latitude">
              <Input value={form.latitude} onChange={(e) => update("latitude", e.target.value)} />
            </Field>
            <Field label="Longitude">
              <Input value={form.longitude} onChange={(e) => update("longitude", e.target.value)} />
            </Field>
          </div>
          <Field label="Horário">
            <Input value={form.horario} onChange={(e) => update("horario", e.target.value)} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Telefone">
              <Input value={form.telefone} onChange={(e) => update("telefone", e.target.value)} />
            </Field>
            <Field label="E-mail">
              <Input value={form.email} onChange={(e) => update("email", e.target.value)} />
            </Field>
          </div>
        </Fieldset>

        <Button onClick={handleSave} disabled={saving || !form.hero_titulo.trim()}>
          {saving ? "Salvando..." : "Salvar conteúdo"}
        </Button>
      </div>
    </section>
  );
}

/* ─── Team section ─── */

type MemberForm = { cargo: string; nome: string; email: string; ordem: string };
const EMPTY_MEMBER: MemberForm = { cargo: "", nome: "", email: "", ordem: "0" };

function TeamSection() {
  const queryClient = useQueryClient();
  const { data: equipe, isLoading } = useSeturEquipe();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SeturMembro | null>(null);
  const [form, setForm] = useState<MemberForm>(EMPTY_MEMBER);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_MEMBER, ordem: String((equipe?.length ?? 0) + 1) });
    setDialogOpen(true);
  }

  function openEdit(member: SeturMembro) {
    setEditing(member);
    setForm({
      cargo: member.cargo,
      nome: member.nome,
      email: member.email ?? "",
      ordem: String(member.ordem),
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nome.trim() || !form.cargo.trim()) return;
    setSaving(true);
    try {
      const payload = {
        cargo: form.cargo,
        nome: form.nome,
        email: form.email || null,
        ordem: parseInt(form.ordem, 10) || 0,
        updated_at: new Date().toISOString(),
      };
      if (editing) {
        const { error } = await supabase.from("setur_equipe").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("setur_equipe").insert(payload);
        if (error) throw error;
      }
      await queryClient.invalidateQueries({ queryKey: ["setur_equipe"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar membro:", err);
      alert("Erro ao salvar membro. Verifique o console.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este membro?")) return;
    const { error } = await supabase.from("setur_equipe").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir membro.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["setur_equipe"] });
  }

  return (
    <section className="rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Equipe</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            <Plus size={16} /> Novo membro
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar membro" : "Novo membro"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Cargo *">
                <Input value={form.cargo} onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))} />
              </Field>
              <Field label="Nome *">
                <Input value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
              </Field>
              <Field label="E-mail">
                <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </Field>
              <Field label="Ordem">
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm((f) => ({ ...f, ordem: e.target.value }))}
                />
              </Field>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ordem</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cargo / Nome</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">E-mail</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td className="px-4 py-3" colSpan={4}>
                  <Skeleton className="h-6 w-full" />
                </td>
              </tr>
            ) : (
              equipe?.map((m) => (
                <tr key={m.id} className="hover:bg-muted">
                  <td className="px-4 py-3 text-muted-foreground">{m.ordem}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.cargo}</p>
                    <p className="font-medium text-foreground">{m.nome}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.email ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(m)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(m.id)}>
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ─── Helpers ─── */

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-md border bg-muted/30 p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
