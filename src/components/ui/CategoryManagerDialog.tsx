import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

type CategoryRow = {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  cor?: string | null;
  ordem: number;
  ativo?: boolean;
};

type CategoryManagerDialogProps = {
  open: boolean;
  onClose: () => void;
  table: string;
  queryKey: string;
  title: string;
  hasCor?: boolean;
  hasAtivo?: boolean;
};

export function CategoryManagerDialog({
  open,
  onClose,
  table,
  queryKey,
  title,
  hasCor = false,
  hasAtivo = false,
}: CategoryManagerDialogProps) {
  const qc = useQueryClient();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ nome: "", icone: "", cor: "" });
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ nome: "", icone: "", cor: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order("ordem");
    if (!error && data) setCategories(data as CategoryRow[]);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, table]);

  function startEdit(cat: CategoryRow) {
    setEditingId(cat.id);
    setEditForm({ nome: cat.nome, icone: cat.icone ?? "", cor: cat.cor ?? "" });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    if (!editForm.nome.trim()) return;
    const payload: Record<string, unknown> = {
      nome: editForm.nome.trim(),
      slug: slugify(editForm.nome),
      icone: editForm.icone || null,
    };
    if (hasCor) payload.cor = editForm.cor || null;
    const { error } = await supabase.from(table).update(payload).eq("id", id);
    if (error) {
      alert("Erro ao salvar categoria.");
      return;
    }
    setEditingId(null);
    await load();
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  async function saveCreate() {
    if (!createForm.nome.trim()) return;
    const payload: Record<string, unknown> = {
      nome: createForm.nome.trim(),
      slug: slugify(createForm.nome),
      icone: createForm.icone || null,
      ordem: categories.length,
    };
    if (hasCor) payload.cor = createForm.cor || null;
    if (hasAtivo) payload.ativo = true;
    const { error } = await supabase.from(table).insert(payload);
    if (error) {
      alert("Erro ao criar categoria.");
      return;
    }
    setCreateForm({ nome: "", icone: "", cor: "" });
    setCreating(false);
    await load();
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const { error } = await supabase.from(table).delete().eq("id", deleteId);
    if (error) {
      alert("Erro ao excluir categoria. Verifique se há itens vinculados.");
      setDeleteId(null);
      return;
    }
    setDeleteId(null);
    await load();
    qc.invalidateQueries({ queryKey: [queryKey] });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center gap-2 rounded-md border border-border p-2"
                  >
                    {editingId === cat.id ? (
                      <>
                        <Input
                          value={editForm.nome}
                          onChange={(e) => setEditForm((p) => ({ ...p, nome: e.target.value }))}
                          placeholder="Nome"
                          className="flex-1"
                        />
                        <Input
                          value={editForm.icone}
                          onChange={(e) => setEditForm((p) => ({ ...p, icone: e.target.value }))}
                          placeholder="Ícone"
                          className="w-32"
                        />
                        {hasCor && (
                          <Input
                            type="color"
                            value={editForm.cor || "#000000"}
                            onChange={(e) => setEditForm((p) => ({ ...p, cor: e.target.value }))}
                            className="h-9 w-12 cursor-pointer p-1"
                          />
                        )}
                        <Button size="icon" variant="ghost" onClick={() => saveEdit(cat.id)}>
                          <Check size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEdit}>
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        {hasCor && cat.cor && (
                          <span
                            className="h-4 w-4 shrink-0 rounded-full border border-border"
                            style={{ background: cat.cor }}
                          />
                        )}
                        <span className="flex-1 text-sm font-medium text-foreground">{cat.nome}</span>
                        {cat.icone && (
                          <span className="text-xs text-muted-foreground">{cat.icone}</span>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => startEdit(cat)}>
                          <Pencil size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteId(cat.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {creating ? (
              <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-2">
                <Input
                  value={createForm.nome}
                  onChange={(e) => setCreateForm((p) => ({ ...p, nome: e.target.value }))}
                  placeholder="Nome da categoria"
                  className="flex-1"
                  autoFocus
                />
                <Input
                  value={createForm.icone}
                  onChange={(e) => setCreateForm((p) => ({ ...p, icone: e.target.value }))}
                  placeholder="Ícone (ex: globe)"
                  className="w-32"
                />
                {hasCor && (
                  <Input
                    type="color"
                    value={createForm.cor || "#000000"}
                    onChange={(e) => setCreateForm((p) => ({ ...p, cor: e.target.value }))}
                    className="h-9 w-12 cursor-pointer p-1"
                  />
                )}
                <Button size="icon" variant="ghost" onClick={saveCreate}>
                  <Check size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => { setCreating(false); setCreateForm({ nome: "", icone: "", cor: "" }); }}>
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setCreating(true)} className="w-full">
                <Plus size={16} /> Nova categoria
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Excluir categoria?"
        description="Esta ação não pode ser desfeita. Itens vinculados a esta categoria podem ser afetados."
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </>
  );
}
