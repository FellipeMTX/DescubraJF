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
import { useExperiences, useExperienceCategories } from "@/hooks/useExperiences";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import type { Experiencia } from "@/types/database";

type FormData = {
  nome: string;
  descricao_curta: string;
  descricao: string;
  categoria_id: string;
  endereco: string;
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
  categoria_id: "",
  endereco: "",
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
      categoria_id: exp.categoria_id ?? "",
      endereco: exp.endereco ?? "",
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
        slug: slugify(form.nome),
        descricao_curta: form.descricao_curta || null,
        descricao: form.descricao || null,
        categoria_id: form.categoria_id || null,
        endereco: form.endereco || null,
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
        await supabase.from("experiencias").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("experiencias").insert(payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["experiencias"] });
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta experiência?")) return;
    await supabase.from("experiencias").delete().eq("id", id);
    await queryClient.invalidateQueries({ queryKey: ["experiencias"] });
  }

  function updateForm(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experiências</h1>
          <p className="text-sm text-gray-500">
            Gerencie os atrativos turísticos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            <Plus size={16} /> Nova Experiência
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Experiência" : "Nova Experiência"}
              </DialogTitle>
            </DialogHeader>
            <ExperienceForm
              form={form}
              categories={categories ?? []}
              imageFile={imageFile}
              saving={saving}
              onUpdate={updateForm}
              onImageChange={setImageFile}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Categoria</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
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
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {exp.imagem_destaque ? (
                          <img
                            src={exp.imagem_destaque}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                            Sem foto
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{exp.nome}</p>
                          <p className="text-xs text-gray-500">{exp.endereco}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {exp.categoria && (
                        <Badge
                          className="text-white"
                          style={{ backgroundColor: exp.categoria.cor ?? "#3b82f6" }}
                        >
                          {exp.categoria.nome}
                        </Badge>
                      )}
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
  saving,
  onUpdate,
  onImageChange,
  onSave,
}: {
  form: FormData;
  categories: { id: string; nome: string }[];
  imageFile: File | null;
  saving: boolean;
  onUpdate: (field: keyof FormData, value: string | boolean) => void;
  onImageChange: (file: File | null) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Nome *</label>
        <Input
          value={form.nome}
          onChange={(e) => onUpdate("nome", e.target.value)}
          placeholder="Ex: Museu Mariano Procópio"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Descrição curta</label>
        <Input
          value={form.descricao_curta}
          onChange={(e) => onUpdate("descricao_curta", e.target.value)}
          placeholder="Para os cards (1-2 frases)"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Descrição completa</label>
        <Textarea
          value={form.descricao}
          onChange={(e) => onUpdate("descricao", e.target.value)}
          rows={4}
          placeholder="Descrição detalhada da experiência"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Categoria</label>
        <select
          value={form.categoria_id}
          onChange={(e) => onUpdate("categoria_id", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Selecione...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Foto principal</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
        />
        {imageFile && (
          <p className="mt-1 text-xs text-gray-500">{imageFile.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Endereço</label>
          <Input
            value={form.endereco}
            onChange={(e) => onUpdate("endereco", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Bairro</label>
          <Input
            value={form.bairro}
            onChange={(e) => onUpdate("bairro", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Latitude</label>
          <Input
            value={form.latitude}
            onChange={(e) => onUpdate("latitude", e.target.value)}
            placeholder="-21.7469"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Longitude</label>
          <Input
            value={form.longitude}
            onChange={(e) => onUpdate("longitude", e.target.value)}
            placeholder="-43.3560"
          />
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
                className="rounded border-gray-300"
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
