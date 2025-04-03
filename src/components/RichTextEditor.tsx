import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Square,
  Loader2,
  Upload
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
}

export default function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content) {
      // Only update if the content is different to avoid cursor jumping
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    const url = await onImageUpload(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addCTAButton = () => {
    const url = window.prompt("Enter CTA button URL");
    const text = window.prompt("Enter CTA button text");
    if (url && text) {
      editor.chain()
        .focus()
        .insertContent(`<a href="${url}" class="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">${text}</a>`)
        .run();
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-muted" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-muted" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-muted" : ""}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Headers */}
        <div className="flex gap-1 border-r pr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={editor.isActive("heading", { level: 4 }) ? "bg-muted" : ""}
          >
            <Heading4 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists and Quote */}
        <div className="flex gap-1 border-r pr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-muted" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "bg-muted" : ""}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? "bg-muted" : ""}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? "bg-muted" : ""}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? "bg-muted" : ""}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Links and Images */}
        <div className="flex gap-1 border-r pr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={editor.isActive("link") ? "bg-muted" : ""}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
            <Button
              variant="ghost"
              size="sm"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={addCTAButton}
            title="Add CTA Button"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  );
}