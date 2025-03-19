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
import { Collapse, IconButton } from '@mui/material';
import { useState } from 'react';
import { Piano as PianoIcon, PianoOff } from '@mui/icons-material';
import { IChord } from '../../types/song.types.ts';
import { DOMSerializer } from 'prosemirror-model';
import TypedTableCell from '../ClassTableCell.tsx';
import { extractChordsFromFragment, flattenChords } from './converter/htmlToSong.converter.ts';

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
      TypedTableCell,
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

  const getSelectedChords = (): IChord[] | undefined => {
    if (!editor) return;
    const slice = editor.state.selection.content();
    const serializer = DOMSerializer.fromSchema(editor.schema);
    const fragment = serializer.serializeFragment(slice.content);
    const div = document.createElement('div');
    div.appendChild(fragment);

    return flattenChords(extractChordsFromFragment(div.innerHTML));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
      <div style={{ display: 'flex' }}>
        <IconButton onClick={() => setPianoOpen(!pianoOpen)}>{pianoOpen ? <PianoOff /> : <PianoIcon />}</IconButton>
      </div>
      <Collapse in={pianoOpen} unmountOnExit>
        <Piano setOpen={setPianoOpen} chordsToPlayProvider={getSelectedChords} />
      </Collapse>
      <StyledEditorContent editor={editor} />
    </div>
  );
};

export default SongTableEditor;
