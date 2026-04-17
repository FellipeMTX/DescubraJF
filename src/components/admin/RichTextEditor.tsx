import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo,
  Images, Minus,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/storage";
import { GalleryExtension } from "@/components/admin/tiptap/GalleryExtension";
import { TextColorExtension } from "@/components/admin/tiptap/TextColorExtension";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function RichTextEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full h-auto" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary-600 underline" } }),
      GalleryExtension,
      TextColorExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "post-content focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      const url = await uploadImage(file, "posts");
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
      alert("Erro ao enviar imagem.");
    } finally {
      e.target.value = "";
    }
  }

  function handleLink() {
    const previous = editor!.getAttributes("link").href ?? "";
    const url = window.prompt("URL do link", previous);
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-md border border-input bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Negrito">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Itálico">
          <Italic size={16} />
        </ToolbarButton>
        <ColorButton editor={editor} />
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Título">
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Subtítulo">
          <Heading3 size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Lista">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Lista numerada">
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Citação">
          <Quote size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={handleLink} active={editor.isActive("link")} label="Link">
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} label="Imagem">
          <ImageIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().insertContent({ type: "gallery", attrs: { images: [] } }).run()}
          label="Galeria"
        >
          <Images size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          label="Divisória"
        >
          <Minus size={16} />
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} label="Desfazer">
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} label="Refazer">
          <Redo size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick, active, disabled, label, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(active && "bg-primary-100 text-primary-700")}
    >
      {children}
    </Button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-border" />;
}

function ColorButton({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const current = (editor?.getAttributes("textColor").color as string | undefined) ?? "#0E0929";
  return (
    <div className="relative inline-flex items-center">
      <label
        title="Cor do texto"
        aria-label="Cor do texto"
        className="flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-xs hover:bg-primary-100"
      >
        <span className="font-semibold">A</span>
        <span
          className="h-3 w-4 rounded-sm border border-border"
          style={{ backgroundColor: current }}
        />
        <input
          type="color"
          value={current}
          onChange={(e) => editor?.chain().focus().setTextColor(e.target.value).run()}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
      {editor?.isActive("textColor") && (
        <button
          type="button"
          title="Remover cor"
          aria-label="Remover cor"
          onClick={() => editor.chain().focus().unsetTextColor().run()}
          className="ml-0.5 rounded px-1 text-xs text-muted-foreground hover:bg-primary-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
