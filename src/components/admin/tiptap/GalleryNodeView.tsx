import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { GalleryUploader } from "@/components/admin/GalleryUploader";

export function GalleryNodeView({ node, updateAttributes }: NodeViewProps) {
  const images: string[] = Array.isArray(node.attrs.images) ? node.attrs.images : [];

  return (
    <NodeViewWrapper className="my-4">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Galeria
      </div>
      <GalleryUploader
        value={images}
        onChange={(urls) => updateAttributes({ images: urls })}
      />
    </NodeViewWrapper>
  );
}
