import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { AddressSearch } from "@/components/ui/AddressSearch";
import { MapPreview } from "@/components/ui/MapPreview";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { CategoryManagerDialog } from "@/components/ui/CategoryManagerDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { CategoryPills } from "@/components/ui/CategoryPills";
import { cn } from "@/lib/utils";
import { useExperiences, useExperienceCategories } from "@/hooks/useExperiences";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { uniqueSlug } from "@/lib/slug";
import { IMAGE_RATIOS_NUM } from "@/lib/constants";
import type { Experiencia } from "@/types/database";

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
  gratuito: boolean;
  acessibilidade: boolean;
  pet_friendly: boolean;
  destaque: boolean;
};

const EMPTY_FORM: FormData = {
  nome: "",
  descricao_curta: "",
  descricao: "",
  categoria_ids: [],
  endereco: "",
  numero: "",
  bairro: "",
  latitude: "",
  longitude: "",
  gratuito: false,
  acessibilidade: false,
  pet_friendly: false,
  destaque: false,
};

export default function ExperienceAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Experiencia | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: experiences, isLoading } = useExperiences();
  const { data: categories } = useExperienceCategories();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setDialogOpen(true);
  }

  function openEdit(exp: Experiencia) {
    setEditing(exp);
    setForm({
      nome: exp.nome,
      descricao_curta: exp.descricao_curta ?? "",
      descricao: exp.descricao ?? "",
      categoria_ids: exp.categoria_ids ?? [],
      endereco: exp.endereco ?? "",
      numero: "",
      bairro: exp.bairro ?? "",
      latitude: exp.latitude?.toString() ?? "",
      longitude: exp.longitude?.toString() ?? "",
      gratuito: exp.gratuito,
      acessibilidade: exp.acessibilidade,
      pet_friendly: exp.pet_friendly,
      destaque: exp.destaque,
    });
    setImageFile(null);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.nome.trim()) return;
    setSaving(true);

    try {
      let imagem_destaque = editing?.imagem_destaque ?? null;
      if (imageFile) {
        imagem_destaque = await uploadImage(imageFile, "experiencias");
      }

      const payload = {
        nome: form.nome,
        slug: await uniqueSlug(form.nome, "experiencias", editing?.id),
        descricao_curta: form.descricao_curta || null,
        descricao: form.descricao || null,
        categoria_ids: form.categoria_ids,
        categoria_id: form.categoria_ids[0] ?? null,
        endereco: [form.endereco, form.numero].filter(Boolean).join(", ") || null,
        bairro: form.bairro || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        gratuito: form.gratuito,
        acessibilidade: form.acessibilidade,
        pet_friendly: form.pet_friendly,
        destaque: form.destaque,
        imagem_destaque,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("experiencias").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("experiencias").insert(payload);
        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["experiencias"] });
      await queryClient.invalidateQueries({ queryKey: ["experiencia"] });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar atrativo:", err);
      alert("Erro ao salvar atrativo. Verifique o console para detalhes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este atrativo?")) return;
    const { error } = await supabase.from("experiencias").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir atrativo.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["experiencias"] });
  }

  function updateForm(field: keyof FormData, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Atrativos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os atrativos turísticos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setManagerOpen(true)}
          >
            Gerenciar categorias
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            <Plus size={16} /> Novo Atrativo
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Atrativo" : "Novo Atrativo"}
              </DialogTitle>
            </DialogHeader>
            <ExperienceForm
              form={form}
              categories={categories ?? []}
              imageFile={imageFile}
              currentImageUrl={editing?.imagem_destaque ?? null}
              saving={saving}
              onUpdate={updateForm}
              onImageChange={setImageFile}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <CategoryManagerDialog
        open={managerOpen}
        onClose={() => setManagerOpen(false)}
        table="categorias_experiencia"
        queryKey="categorias_experiencia"
        title="Gerenciar categorias de atrativos"
        hasCor
        hasAtivo
      />

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categoria</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3" colSpan={4}>
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              : experiences?.map((exp) => (
                  <tr key={exp.id} className="hover:bg-muted">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {exp.imagem_destaque ? (
                          <img
                            src={exp.imagem_destaque}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                            Sem foto
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{exp.nome}</p>
                          <p className="text-xs text-muted-foreground">{exp.endereco}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryPills categorias={exp.categorias} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {exp.destaque && <Badge variant="secondary">Destaque</Badge>}
                        {exp.gratuito && <Badge variant="secondary">Gratuito</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(exp)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(exp.id)}>
                          <Trash2 size={14} className="text-red-500" />
                        </Button>
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

function ExperienceForm({
  form,
  categories,
  imageFile,
  currentImageUrl,
  saving,
  onUpdate,
  onImageChange,
  onSave,
}: {
  form: FormData;
  categories: { id: string; nome: string }[];
  imageFile: File | null;
  currentImageUrl: string | null;
  saving: boolean;
  onUpdate: (field: keyof FormData, value: string | boolean | string[]) => void;
  onImageChange: (file: File | null) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Nome *</label>
        <Input
          value={form.nome}
          onChange={(e) => onUpdate("nome", e.target.value)}
          placeholder="Ex: Museu Mariano Procópio"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Descrição curta</label>
        <Input
          value={form.descricao_curta}
          onChange={(e) => onUpdate("descricao_curta", e.target.value)}
          placeholder="Para os cards (1-2 frases)"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Descrição completa</label>
        <Textarea
          value={form.descricao}
          onChange={(e) => onUpdate("descricao", e.target.value)}
          rows={4}
          placeholder="Descrição detalhada do atrativo"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Categorias</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const checked = form.categoria_ids.includes(cat.id);
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() =>
                  onUpdate(
                    "categoria_ids",
                    checked
                      ? form.categoria_ids.filter((id) => id !== cat.id)
                      : [...form.categoria_ids, cat.id]
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  checked
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-input text-foreground hover:bg-muted"
                )}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>
      </div>

      <ImageUploadField
        label="Foto principal"
        value={imageFile}
        onChange={onImageChange}
        aspect={IMAGE_RATIOS_NUM.cardPortrait}
        currentUrl={currentImageUrl}
      />

      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">Localização</h3>
        <InfoTooltip text="Use a ferramenta de buscar endereço para facilitar a busca. Caso não seja encontrado, digite o endereço manualmente e busque sua geolocalização no Google Maps." />
      </div>
      <div className="flex gap-2">
        <AddressSearch
          onSelect={(data) => {
            onUpdate("endereco", data.endereco);
            onUpdate("bairro", data.bairro);
            onUpdate("latitude", data.latitude);
            onUpdate("longitude", data.longitude);
          }}
        />
        <MapPreview latitude={form.latitude} longitude={form.longitude} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="text-sm font-medium text-foreground">Endereço</label>
          <Input value={form.endereco} onChange={(e) => onUpdate("endereco", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Número</label>
          <Input value={form.numero} onChange={(e) => onUpdate("numero", e.target.value)} placeholder="123" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Bairro</label>
        <Input value={form.bairro} onChange={(e) => onUpdate("bairro", e.target.value)} />
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground">Latitude</label>
          <Input value={form.latitude} onChange={(e) => onUpdate("latitude", e.target.value)} placeholder="-21.7469" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Longitude</label>
          <Input value={form.longitude} onChange={(e) => onUpdate("longitude", e.target.value)} placeholder="-43.3560" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {(["gratuito", "acessibilidade", "pet_friendly", "destaque"] as const).map(
          (field) => (
            <label key={field} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form[field]}
                onChange={(e) => onUpdate(field, e.target.checked)}
                className="rounded border-input"
              />
              {field === "pet_friendly"
                ? "Pet Friendly"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
          )
        )}
      </div>

      <Button onClick={onSave} disabled={saving || !form.nome.trim()} className="w-full">
        {saving ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
}
