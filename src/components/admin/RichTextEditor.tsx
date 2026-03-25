"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { 
  Bold, Italic, List, Link as LinkIcon, 
  ImagePlus, Type, Eye, Heading2, 
  Underline as UnderlineIcon, Undo, Redo,
  Code, Layout
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<string | null>;
}

// Helper to add spacing for non-tech users in HTML mode
const formatHTML = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<\/p>/g, '</p>\n\n')
    .replace(/<\/h[1-6]>/g, (match) => `${match}\n\n`)
    .replace(/<\/blockquote>/g, '</blockquote>\n\n')
    .replace(/<\/ul>/g, '</ul>\n\n')
    .replace(/<\/ol>/g, '</ol>\n\n')
    .replace(/<br\s*\/?>/g, '<br />\n')
    .trim();
};

export default function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'write' | 'html' | 'preview'>('write');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localHTML, setLocalHTML] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-600 hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'w-full rounded-xl my-6 shadow-md',
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-red max-w-none focus:outline-none min-h-[500px] p-8 bg-white',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            void handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setLocalHTML(html);
      onChange(html);
    },
  });

  // Keep localHTML and editor in sync with external content
  useEffect(() => {
    if (content !== localHTML) {
      setLocalHTML(content);
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  // Handle mode switching content sync
  useEffect(() => {
    if (mode === 'write' && editor && localHTML !== editor.getHTML()) {
      editor.commands.setContent(localHTML);
    }
  }, [mode, editor]);

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const url = await onImageUpload(file);
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } finally {
      setUploading(false);
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!editor) return null;

  const insertTag = (tag: string) => {
    if (mode !== 'html') return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;
    const newValue = formatHTML(before + openTag + selection + closeTag + after);
    
    setLocalHTML(newValue);
    onChange(newValue);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, end + openTag.length);
    }, 0);
  };

  return (
    <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      {/* Toolbar */}
      <div className="bg-muted border-b border-border p-2 flex items-center flex-wrap gap-1 sticky top-0 z-10">
        <div className="flex bg-muted/50 p-1 rounded-lg mr-4 border border-border">
          <button
            onClick={() => setMode('write')}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${mode === 'write' ? 'bg-card text-red-600 shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
            type="button"
          >
            <Type className="h-3 w-3" /> Write
          </button>
          <button
            onClick={() => {
              const formatted = formatHTML(localHTML);
              setLocalHTML(formatted);
              setMode('html');
            }}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${mode === 'html' ? 'bg-card text-red-600 shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
            type="button"
          >
            <Code className="h-3 w-3" /> HTML Tags
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${mode === 'preview' ? 'bg-card text-red-600 shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
            type="button"
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>

        {mode !== 'preview' ? (
          <>
            <div className="flex items-center gap-0.5 mr-2">
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().toggleBold().run() : insertTag('strong')}
                className={`p-2 rounded hover:bg-muted transition-colors ${mode === 'write' && editor.isActive('bold') ? 'bg-red-500/10 text-red-600' : 'text-muted-foreground'}`}
                type="button"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().toggleItalic().run() : insertTag('em')}
                className={`p-2 rounded hover:bg-muted transition-colors ${mode === 'write' && editor.isActive('italic') ? 'bg-red-500/10 text-red-600' : 'text-muted-foreground'}`}
                type="button"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().toggleUnderline().run() : insertTag('u')}
                className={`p-2 rounded hover:bg-muted transition-colors ${mode === 'write' && editor.isActive('underline') ? 'bg-red-500/10 text-red-600' : 'text-muted-foreground'}`}
                type="button"
                title="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-border mx-1" />

            <div className="flex items-center gap-0.5 mr-2">
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().toggleHeading({ level: 1 }).run() : insertTag('h1')}
                className={`p-2 rounded hover:bg-muted transition-colors ${mode === 'write' && editor.isActive('heading', { level: 1 }) ? 'bg-red-500/10 text-red-600' : 'text-muted-foreground'}`}
                type="button"
                title="Heading 1"
              >
                <span className="text-[10px] font-bold">H1</span>
              </button>
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().toggleHeading({ level: 2 }).run() : insertTag('h2')}
                className={`p-2 rounded hover:bg-muted transition-colors ${mode === 'write' && editor.isActive('heading', { level: 2 }) ? 'bg-red-500/10 text-red-600' : 'text-muted-foreground'}`}
                type="button"
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().toggleBulletList().run() : insertTag('ul')}
                className={`p-2 rounded hover:bg-muted transition-colors ${mode === 'write' && editor.isActive('bulletList') ? 'bg-red-500/10 text-red-600' : 'text-muted-foreground'}`}
                type="button"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().setParagraph().run() : insertTag('p')}
                className={`p-2 rounded hover:bg-muted transition-colors text-muted-foreground`}
                type="button"
                title="Paragraph"
              >
                <span className="text-[10px] font-bold">P</span>
              </button>
            </div>

            <div className="h-6 w-px bg-border mx-1" />

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => {
                  const url = window.prompt('Enter the URL');
                  if (url) {
                    if (mode === 'write') {
                      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    } else {
                      const textarea = textareaRef.current;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const selection = text.substring(start, end);
                        const before = text.substring(0, start);
                        const after = text.substring(end);
                        const newValue = before + `<a href="${url}">` + selection + "</a>" + after;
                        setLocalHTML(newValue);
                        onChange(newValue);
                      }
                    }
                  }
                }}
                className={`p-2 rounded hover:bg-muted transition-colors ${mode === 'write' && editor.isActive('link') ? 'bg-red-500/10 text-red-600' : 'text-muted-foreground'}`}
                type="button"
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded hover:bg-muted text-red-600 transition-colors"
                type="button"
                title="Insert Image"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImageUpload(file);
                  e.target.value = '';
                }}
              />
            </div>

            <div className="ml-auto flex items-center gap-0.5">
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().undo().run() : undefined}
                disabled={mode === 'write' ? !editor.can().chain().focus().undo().run() : true}
                className="p-2 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                type="button"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </button>
              <button
                onClick={() => mode === 'write' ? editor.chain().focus().redo().run() : undefined}
                disabled={mode === 'write' ? !editor.can().chain().focus().redo().run() : true}
                className="p-2 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                type="button"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1 bg-muted rounded-md border border-border">
            Final Preview Mode
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="relative">
        {mode === 'write' ? (
          <EditorContent editor={editor} />
        ) : mode === 'html' ? (
          <textarea
            ref={textareaRef}
            value={localHTML}
            onChange={(e) => {
              setLocalHTML(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full h-[500px] p-8 font-mono text-sm focus:outline-none bg-background text-foreground leading-relaxed border-0"
            spellCheck={false}
          />
        ) : (
          <div 
            className="prose prose-red dark:prose-invert max-w-none min-h-[500px] p-8 bg-background text-foreground article-content"
            dangerouslySetInnerHTML={{ __html: localHTML }}
          />
        )}
        
        {uploading && mode === 'write' && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all font-semibold text-red-600">
            Uploading image...
          </div>
        )}

        {mode === 'write' && !content && !editor.isFocused && (
          <div className="absolute top-8 left-8 text-muted-foreground/50 pointer-events-none italic">
            Start writing your article here...
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-muted border-t border-border px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
        <div className="flex gap-4">
          <span>{editor.storage.characterCount?.characters?.() || editor.getText().length} Characters</span>
          <span>{editor.getText().split(/\s+/).filter(Boolean).length} Words</span>
        </div>
        <div className="text-red-600 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {mode === 'write' ? 'WYSIWYG Mode' : mode === 'html' ? 'HTML Tags Mode' : 'Preview Mode'}
        </div>
      </div>

      <style jsx global>{`
        .ProseMirror p, .article-content p {
          margin-bottom: 1.5rem !important;
          line-height: 1.8;
        }
        .ProseMirror h1, .ProseMirror h2, .article-content h1, .article-content h2 {
          margin-top: 2.5rem !important;
          margin-bottom: 1rem !important;
        }
        .ProseMirror h1:first-child, .ProseMirror h2:first-child, .article-content h1:first-child, .article-content h2:first-child {
          margin-top: 0 !important;
        }
      `}</style>
    </div>
  );
}
