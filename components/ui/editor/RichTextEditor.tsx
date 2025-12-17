"use client";

import React from "react";
import clsx from "clsx";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import TitleIcon from "@mui/icons-material/Title";
import LinkIcon from "@mui/icons-material/Link";
import FormatClearIcon from "@mui/icons-material/FormatClear";

function isEmptyHtml(html: string) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length === 0;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const editor = useEditor({
    // TipTap recommendation for Next.js/SSR to avoid hydration mismatches
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "tiptap-editor w-full min-h-[260px] outline-none px-4 py-3 text-sm text-gray-900",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  const toolbarBtn = (active: boolean) =>
    clsx(
      "p-2 rounded-lg border transition-colors",
      active
        ? "bg-orange-50 border-orange-200 text-orange-700"
        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
    );

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL", previousUrl || "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  const clearFormatting = () => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const empty = isEmptyHtml(value || "");

  return (
    <div className={clsx("w-full", className)}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            className={toolbarBtn(!!editor?.isActive("bold"))}
            title="Bold"
          >
            <FormatBoldIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            className={toolbarBtn(!!editor?.isActive("italic"))}
            title="Italic"
          >
            <FormatItalicIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={toolbarBtn(!!editor?.isActive("underline"))}
            title="Underline"
          >
            <FormatUnderlinedIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={toolbarBtn(!!editor?.isActive("heading", { level: 2 }))}
            title="Heading"
          >
            <TitleIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={toolbarBtn(!!editor?.isActive("bulletList"))}
            title="Bullet list"
          >
            <FormatListBulletedIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={toolbarBtn(!!editor?.isActive("orderedList"))}
            title="Ordered list"
          >
            <FormatListNumberedIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={setLink}
            className={toolbarBtn(!!editor?.isActive("link"))}
            title="Link"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={clearFormatting}
            className={toolbarBtn(false)}
            title="Clear formatting"
          >
            <FormatClearIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-gray-500">
          {empty ? "Chưa có nội dung" : "Đã có nội dung"}
        </div>
      </div>

      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}


