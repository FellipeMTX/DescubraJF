import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { IMAGE_RATIOS_NUM } from "@/lib/constants";
import { RepeatableList } from "./RepeatableList";
import { SectionBox } from "./fields";
import { emptyPonto, type PontoDraft } from "./defaults";

type Props = {
  items: PontoDraft[];
  onChange: (items: PontoDraft[]) => void;
};

export function RoteiroPontosFields({ items, onChange }: Props) {
  return (
    <SectionBox title="Destaques (pontos do roteiro)">
      <RepeatableList
        items={items}
        addLabel="Adicionar destaque"
        newItem={emptyPonto}
        onChange={onChange}
        getKey={(it) => it.id}
        renderItem={(it, upd) => (
          <div className="space-y-2">
            <Input value={it.nome} onChange={(e) => upd({ nome: e.target.value })} placeholder="Nome (ex: Independência Shopping)" />
            <Textarea rows={2} value={it.descricao} onChange={(e) => upd({ descricao: e.target.value })} placeholder="Descrição curta" />
            <Input value={it.local} onChange={(e) => upd({ local: e.target.value })} placeholder="Local (ex: Centro)" />
            <ImageUploadField
              value={it.file}
              onChange={(file) => upd({ file })}
              aspect={IMAGE_RATIOS_NUM.cardLandscape}
              currentUrl={it.imagem}
              label="Imagem"
            />
          </div>
        )}
      />
    </SectionBox>
  );
}
