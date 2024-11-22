import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Heading1, Heading2, Table, Undo, Redo,
  Download, FileText as WordIcon, FileText
} from 'lucide-react';
import { exportToPDF, exportToWord } from '../utils/exportUtils';

interface EditorToolbarProps {
  editor: Editor;
}

const ToolbarButton = ({ onClick, active, disabled, children, title }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      disabled ? 'opacity-50 cursor-not-allowed' :
      active ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' :
      'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const ToolbarSelect = ({ value, onChange, options, className }: any) => (
  <select
    value={value}
    onChange={onChange}
    className={`p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
  >
    {options.map((option: any) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const handleExport = async (type: 'pdf' | 'word') => {
    try {
      const content = editor.getHTML();
      if (type === 'pdf') {
        await exportToPDF(content);
      } else {
        await exportToWord(content);
      }
    } catch (error) {
      console.error(`Error exporting to ${type}:`, error);
    }
  };

  const fontFamilies = [
    { value: '', label: 'Font Family' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' }
  ];

  const fontSizes = [
    { value: '', label: 'Font Size' },
    { value: '12px', label: 'Small' },
    { value: '16px', label: 'Normal' },
    { value: '20px', label: 'Large' },
    { value: '24px', label: 'Extra Large' }
  ];

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2 bg-white sticky top-0 z-40">
      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <Underline className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarSelect
          value={editor.getAttributes('textStyle').fontFamily}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
          options={fontFamilies}
          className="w-40"
        />
        <ToolbarSelect
          value={editor.getAttributes('textStyle').fontSize}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            editor.chain().focus().setFontSize(e.target.value).run()
          }
          options={fontSizes}
          className="w-32"
        />
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({
            rows: 3,
            cols: 3,
            withHeaderRow: true
          }).run()}
          title="Insert Table"
        >
          <Table className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => handleExport('word')}
          title="Export to Word"
        >
          <WordIcon className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => handleExport('pdf')}
          title="Export to PDF"
        >
          <FileText className="w-5 h-5" />
        </ToolbarButton>
      </div>
    </div>
  );
}