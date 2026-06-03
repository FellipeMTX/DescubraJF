import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { RoteiroLayout } from "@/types/database";
import { Field, SectionBox } from "./fields";
import { IconField } from "./IconField";
import { RepeatableList } from "./RepeatableList";

type Props = {
  value: RoteiroLayout;
  onChange: (layout: RoteiroLayout) => void;
};

export function RoteiroLayoutFields({ value, onChange }: Props) {
  const setHero = (p: Partial<RoteiroLayout["hero"]>) => onChange({ ...value, hero: { ...value.hero, ...p } });
  const setSobre = (p: Partial<RoteiroLayout["sobre"]>) => onChange({ ...value, sobre: { ...value.sobre, ...p } });
  const setCard = (p: Partial<RoteiroLayout["sobre"]["card"]>) =>
    onChange({ ...value, sobre: { ...value.sobre, card: { ...value.sobre.card, ...p } } });
  const setCta = (p: Partial<RoteiroLayout["bottomCta"]>) =>
    onChange({ ...value, bottomCta: { ...value.bottomCta, ...p } });

  return (
    <div className="space-y-4">
      <SectionBox title="Hero">
        <Field label="Etiqueta (eyebrow)">
          <Input value={value.hero.eyebrow ?? ""} onChange={(e) => setHero({ eyebrow: e.target.value })} placeholder="Ex: Caminhos pela cidade" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Título">
            <Input value={value.hero.titulo} onChange={(e) => setHero({ titulo: e.target.value })} placeholder="Ex: Caminho das" />
          </Field>
          <Field label="Palavra em destaque (itálico)">
            <Input value={value.hero.tituloAccent ?? ""} onChange={(e) => setHero({ tituloAccent: e.target.value })} placeholder="Ex: Compras" />
          </Field>
        </div>
        <Field label="Subtítulo">
          <Textarea rows={2} value={value.hero.subtitulo ?? ""} onChange={(e) => setHero({ subtitulo: e.target.value })} />
        </Field>
        <Field label="Descrição">
          <Textarea rows={3} value={value.hero.descricao ?? ""} onChange={(e) => setHero({ descricao: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Botão principal" hint="Rola até o mapa">
            <Input value={value.hero.ctaPrimaryLabel ?? ""} onChange={(e) => setHero({ ctaPrimaryLabel: e.target.value })} placeholder="Ver no mapa" />
          </Field>
          <Field label="Botão secundário" hint="Opcional">
            <Input value={value.hero.ctaSecondaryLabel ?? ""} onChange={(e) => setHero({ ctaSecondaryLabel: e.target.value })} placeholder="Salvar roteiro" />
          </Field>
        </div>
      </SectionBox>

      <SectionBox title="Estatísticas (até 6)">
        <RepeatableList
          items={value.stats}
          max={6}
          addLabel="Adicionar estatística"
          newItem={() => ({ icon: "map-pin", label: "", value: "", descricao: "" })}
          onChange={(stats) => onChange({ ...value, stats })}
          renderItem={(it, upd) => (
            <div className="flex gap-2">
              <IconField value={it.icon} onChange={(icon) => upd({ icon })} />
              <div className="flex-1 space-y-2">
                <Input value={it.label} onChange={(e) => upd({ label: e.target.value })} placeholder="Rótulo (ex: Espaços comerciais)" />
                <Input value={it.value} onChange={(e) => upd({ value: e.target.value })} placeholder="Valor (ex: 40+)" />
                <Input value={it.descricao ?? ""} onChange={(e) => upd({ descricao: e.target.value })} placeholder="Descrição (ex: nesta rota)" />
              </div>
            </div>
          )}
        />
      </SectionBox>

      <SectionBox title="Sobre o roteiro">
        <Field label="Título da seção">
          <Input value={value.sobre.titulo} onChange={(e) => setSobre({ titulo: e.target.value })} />
        </Field>
        <Field label="Parágrafos" hint="Separe parágrafos com uma linha em branco.">
          <Textarea
            rows={5}
            value={value.sobre.paragrafos.join("\n\n")}
            onChange={(e) => setSobre({ paragrafos: e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Título do card">
            <Input value={value.sobre.card.titulo} onChange={(e) => setCard({ titulo: e.target.value })} placeholder="Ex: Comércio que conta histórias" />
          </Field>
          <Field label="Texto do card">
            <Input value={value.sobre.card.descricao ?? ""} onChange={(e) => setCard({ descricao: e.target.value })} />
          </Field>
        </div>
        <Field label="Itens do card (com ícone)">
          <RepeatableList
            items={value.sobre.card.bullets}
            addLabel="Adicionar item"
            newItem={() => ({ icon: "sparkles", titulo: "", descricao: "" })}
            onChange={(bullets) => setCard({ bullets })}
            renderItem={(it, upd) => (
              <div className="flex gap-2">
                <IconField value={it.icon} onChange={(icon) => upd({ icon })} />
                <div className="flex-1 space-y-2">
                  <Input value={it.titulo} onChange={(e) => upd({ titulo: e.target.value })} placeholder="Título" />
                  <Input value={it.descricao ?? ""} onChange={(e) => upd({ descricao: e.target.value })} placeholder="Descrição" />
                </div>
              </div>
            )}
          />
        </Field>
      </SectionBox>

      <SectionBox title="Mapa & Dicas">
        <Field label="Título da seção de destaques">
          <Input value={value.destaquesTitulo ?? ""} onChange={(e) => onChange({ ...value, destaquesTitulo: e.target.value })} placeholder="Destaques do roteiro" />
        </Field>
        <Field label='Link "Abrir no Google Maps"' hint="URL externa (não o embed)">
          <Input value={value.mapsLink ?? ""} onChange={(e) => onChange({ ...value, mapsLink: e.target.value })} placeholder="https://maps.google.com/..." />
        </Field>
        <Field label="Título do card de dicas">
          <Input value={value.dicas.titulo} onChange={(e) => onChange({ ...value, dicas: { ...value.dicas, titulo: e.target.value } })} />
        </Field>
        <Field label="Dicas (com ícone)">
          <RepeatableList
            items={value.dicas.items}
            addLabel="Adicionar dica"
            newItem={() => ({ icon: "clock", titulo: "", descricao: "" })}
            onChange={(items) => onChange({ ...value, dicas: { ...value.dicas, items } })}
            renderItem={(it, upd) => (
              <div className="flex gap-2">
                <IconField value={it.icon} onChange={(icon) => upd({ icon })} />
                <div className="flex-1 space-y-2">
                  <Input value={it.titulo} onChange={(e) => upd({ titulo: e.target.value })} placeholder="Título" />
                  <Input value={it.descricao ?? ""} onChange={(e) => upd({ descricao: e.target.value })} placeholder="Descrição" />
                </div>
              </div>
            )}
          />
        </Field>
      </SectionBox>

      <SectionBox title="Chamada final (CTA)">
        <Field label="Título">
          <Input value={value.bottomCta.titulo} onChange={(e) => setCta({ titulo: e.target.value })} placeholder="Ex: Viva o centro, valorize o local" />
        </Field>
        <Field label="Descrição">
          <Input value={value.bottomCta.descricao ?? ""} onChange={(e) => setCta({ descricao: e.target.value })} />
        </Field>
        <Field label="Texto do botão">
          <Input value={value.bottomCta.label ?? ""} onChange={(e) => setCta({ label: e.target.value })} placeholder="Ver outros roteiros" />
        </Field>
      </SectionBox>
    </div>
  );
}
