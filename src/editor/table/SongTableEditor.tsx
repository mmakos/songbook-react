import { useEditor } from '@tiptap/react';
import { Bold } from '@tiptap/extension-bold';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { HardBreak } from '@tiptap/extension-hard-break';
import { History } from '@tiptap/extension-history';
import StyledEditorContent from '../StyledEditorContent.ts';
import Indent from '../IndentExtension.ts';
import TextReplacer from '../TextReplacer.ts';
import { Italic } from '@tiptap/extension-italic';
import { Underline } from '@tiptap/extension-underline';
import { TableCell } from '@tiptap/extension-table-cell';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import songToHTML from './converter/songToHTML.converter.ts';
import { dzieciHioba } from '../test/dzieci-hioba.json.ts';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Strike } from '@tiptap/extension-strike';
import './styles.css';
import Piano from '../../piano/Piano.tsx';
import { Collapse } from '@mui/material';
import { useState } from 'react';

const SongTableEditor = () => {
  const editor = useEditor({
    extensions: [
      Text,
      Paragraph,
      HardBreak,
      Document,
      Bold,
      Italic,
      Underline,
      Subscript,
      Superscript,
      Strike,
      History,
      Table,
      TableCell,
      TableRow,
      TableHeader,
      TextReplacer,
      Indent.configure({
        types: ['paragraph'],
        minLevel: 0,
        maxLevel: 3,
      }),
    ],
    content: songToHTML(dzieciHioba),
  });
  const [pianoOpen, setPianoOpen] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
      <Collapse in={pianoOpen}>
        <Piano setOpen={setPianoOpen} />
      </Collapse>
      <StyledEditorContent editor={editor} />
    </div>
  );
};

export default SongTableEditor;
