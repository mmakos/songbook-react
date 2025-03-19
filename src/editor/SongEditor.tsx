import { useEditor } from '@tiptap/react';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { HardBreak } from '@tiptap/extension-hard-break';
import { History } from '@tiptap/extension-history';
import StyledEditorContent from './StyledEditorContent.ts';
import Indent from './IndentExtension.ts';
import TextReplacer from './TextReplacer.ts';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import songToHTML from './converter/songToHTML.converter.ts';
import { dzieciHioba } from './test/dzieci-hioba.json.ts';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Strike } from '@tiptap/extension-strike';
import './styles.css';
import Piano from '../piano/Piano.tsx';
import { Collapse, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { Looks3, LooksOne, LooksTwo, Piano as PianoIcon, PianoOff, RecordVoiceOver, Stop } from '@mui/icons-material';
import { IChord } from '../types/song.types.ts';
import { DOMSerializer } from 'prosemirror-model';
import TypedTableCell from './ClassTableCell.tsx';
import { extractChordsFromFragment, flattenChords } from './converter/htmlToSong.converter.ts';
import { cancelSpeech, readText } from './text-reader.ts';
import { ExclusiveBold, ExclusiveItalic, ExclusiveUnderline } from './ExclusiveStyle.ts';

const SongEditor = () => {
  const editor = useEditor({
    extensions: [
      Text,
      Paragraph,
      HardBreak,
      Document,
      ExclusiveBold,
      ExclusiveItalic,
      ExclusiveUnderline,
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
  const [reading, setReading] = useState(false);
  const [style, setStyle] = useState<number>();

  const getSelectedChords = (): IChord[] | undefined => {
    if (!editor) return;
    const slice = editor.state.selection.content();
    const serializer = DOMSerializer.fromSchema(editor.schema);
    const fragment = serializer.serializeFragment(slice.content);
    const div = document.createElement('div');
    div.appendChild(fragment);

    return flattenChords(extractChordsFromFragment(div.innerHTML));
  };

  const readSelectedText = () => {
    if (!editor) return;
    const slice = editor.state.selection.content();
    setReading(true);
    readText(slice.content.textBetween(0, slice.content.size), () => setReading(false));
  };

  const handleStyleChange = (_: MouseEvent, style?: number) => {
    const command = editor?.chain().focus();
    if (style == 1) command?.setItalic().run();
    else if (style == 2) command?.setUnderline().run();
    else if (style == 3) command?.setBold().run();
    else command?.unsetItalic().unsetBold().unsetUnderline().run();
    setStyle(style);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
      <div style={{ display: 'flex' }}>
        <ToggleButtonGroup exclusive value={style} onChange={handleStyleChange}>
          <ToggleButton value="1">
            <LooksOne />
          </ToggleButton>
          <ToggleButton value="2">
            <LooksTwo />
          </ToggleButton>
          <ToggleButton value="3">
            <Looks3 />
          </ToggleButton>
        </ToggleButtonGroup>
        <div style={{ display: 'flex', alignContent: 'center', marginLeft: 'auto' }}>
          <IconButton onClick={() => setPianoOpen(!pianoOpen)}>{pianoOpen ? <PianoOff /> : <PianoIcon />}</IconButton>
          <IconButton onClick={reading ? cancelSpeech : readSelectedText}>
            {reading ? <Stop /> : <RecordVoiceOver />}
          </IconButton>
        </div>
      </div>
      <Collapse in={pianoOpen} unmountOnExit>
        <Piano setOpen={setPianoOpen} chordsToPlayProvider={getSelectedChords} />
      </Collapse>
      <StyledEditorContent editor={editor} />
    </div>
  );
};

export default SongEditor;
