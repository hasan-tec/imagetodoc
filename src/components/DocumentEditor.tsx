import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Typography from '@tiptap/extension-typography';
import { EditorToolbar } from './EditorToolbar';
import { formatContent } from '../utils/textFormatter';

interface DocumentEditorProps {
  initialContent: string;
}

export function DocumentEditor({ initialContent }: DocumentEditorProps) {
  const [formattedContent, setFormattedContent] = useState('');

  useEffect(() => {
    const formatted = formatContent(initialContent);
    setFormattedContent(formatted);
  }, [initialContent]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Typography,
    ],
    content: formattedContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && formattedContent) {
      editor.commands.setContent(formattedContent);
    }
  }, [editor, formattedContent]);

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-[800px] flex flex-col bg-white rounded-lg shadow-lg">
      <EditorToolbar editor={editor} />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <EditorContent editor={editor} className="min-h-[700px] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none" />
        </div>
      </div>
    </div>
  );
}

