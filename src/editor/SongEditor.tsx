import { useEditor } from '@tiptap/react';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { History } from '@tiptap/extension-history';
import StyledEditorContent from './StyledEditorContent.ts';
import Indent from './IndentExtension.ts';
import TextReplacer from './TextReplacer.ts';
import { TableRow } from '@tiptap/extension-table-row';
import songToHTML from './converter/songToHTML.converter.ts';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Strike } from '@tiptap/extension-strike';
import Piano from '../piano/Piano.tsx';
import { Collapse, ToggleButton } from '@mui/material';
import { useState } from 'react';
import {
  Grid4x4,
  Looks3,
  LooksOne,
  LooksTwo,
  Piano as PianoIcon,
  PianoOff,
  RecordVoiceOver,
  Redo,
  Undo,
} from '@mui/icons-material';
import { IChord } from '../types/song.types.ts';
import { DOMSerializer } from 'prosemirror-model';
import { extractChordsFromFragment, flattenChords } from './converter/htmlToSong.converter.ts';
import { cancelSpeech, readText } from './text-reader.ts';
import { ExclusiveBold, ExclusiveItalic, ExclusiveUnderline } from './ExclusiveStyle.ts';
import TypedTableCell from './TypedTableCell.ts';
import { dzieciHioba } from './test/dzieci-hioba.json.ts';
import ParagraphRowTable from './ParagraphRowTable.ts';
import UnmodifiableTableHeader from './UnmodifiableTableHeader.ts';
import PreventCellDrag from './PreventTableDrag.ts';
import InsertRowBottom from './icon/InsertRowBottom.tsx';
import InsertRowTop from './icon/InsertRowTop.tsx';
import InsertChordColumn from './icon/InsertChordColumn.tsx';
import DeleteRow from './icon/DeleteRow.tsx';
import StyledToggleButtonGroup, { StyledToggleButtonGroupDivider } from '../components/StyledToggleButtonGroup.tsx';
import RemoveColumn from './icon/RemoveColumn.tsx';
import InsertRepetitionColumn from './icon/InsertRepetitionColumn.tsx';

const SongEditor = () => {
  const editor = useEditor({
    extensions: [
      Text,
      Paragraph,
      Document,
      ExclusiveBold,
      ExclusiveItalic,
      ExclusiveUnderline,
      Subscript,
      Superscript,
      Strike,
      History,
      ParagraphRowTable,
      TypedTableCell,
      TableRow,
      UnmodifiableTableHeader,
      TextReplacer,
      Indent,
      PreventCellDrag,
    ],
    content: songToHTML(dzieciHioba),
  });
  const [pianoOpen, setPianoOpen] = useState(true);
  const [reading, setReading] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [repetitionColumn, setRepetitionColumn] = useState(false);
  const [additionalChordColumn, setAdditionalChordColumn] = useState(false);

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

  const handleAdditionalChordColumn = () => {
    if (additionalChordColumn) {
      editor?.chain().focus().removeChordsColumn().run();
    } else {
      editor?.chain().focus().addChordsColumn().run();
    }
    setAdditionalChordColumn(!additionalChordColumn);
  };

  const handleRepetitionColumn = () => {
    if (repetitionColumn) {
      editor?.chain().focus().removeRepetitionColumn().run();
    } else {
      editor?.chain().focus().addRepetitionColumn().run()
    }
    setRepetitionColumn(!repetitionColumn);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
      <div style={{ display: 'flex' }}>
        <StyledToggleButtonGroup size="small">
          <ToggleButton
            value="1"
            selected={editor?.isActive('italic')}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <LooksOne />
          </ToggleButton>
          <ToggleButton
            value="2"
            selected={editor?.isActive('underline')}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <LooksTwo />
          </ToggleButton>
          <ToggleButton
            value="3"
            selected={editor?.isActive('bold')}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Looks3 />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <StyledToggleButtonGroupDivider />
        <StyledToggleButtonGroup size="small">
          <ToggleButton
            value="insertRowAfter"
            onClick={() => editor?.chain().focus().addRowAfter().run()}
            disabled={!editor?.can().addRowAfter()}
          >
            <InsertRowBottom />
          </ToggleButton>
          <ToggleButton
            value="insertRowBefore"
            onClick={() => editor?.chain().focus().addRowBefore().run()}
            disabled={!editor?.can().addRowBefore()}
          >
            <InsertRowTop />
          </ToggleButton>
          <ToggleButton
            value="deleteRow"
            onClick={() => editor?.chain().focus().deleteRow().run()}
            disabled={!editor?.can().deleteRow()}
          >
            <DeleteRow />
          </ToggleButton>
          <ToggleButton value="addRepetitionColumn" onClick={handleRepetitionColumn} selected={repetitionColumn}>
            {repetitionColumn ? <RemoveColumn transform="scale(-1,1)" /> : <InsertRepetitionColumn />}
          </ToggleButton>
          <ToggleButton value="addChordsColumn" onClick={handleAdditionalChordColumn} selected={additionalChordColumn}>
            {additionalChordColumn ? <RemoveColumn /> : <InsertChordColumn />}
          </ToggleButton>
        </StyledToggleButtonGroup>
        <StyledToggleButtonGroupDivider />
        <StyledToggleButtonGroup size="small">
          <ToggleButton
            value="undo"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            <Undo />
          </ToggleButton>
          <ToggleButton
            value="redo"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            <Redo />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <StyledToggleButtonGroupDivider />
        <StyledToggleButtonGroup size="small">
          <ToggleButton value="showGrid" selected={showGrid} onChange={() => setShowGrid(!showGrid)}>
            <Grid4x4 />
          </ToggleButton>
          <ToggleButton value="piano" selected={pianoOpen} onClick={() => setPianoOpen(!pianoOpen)}>
            {pianoOpen ? <PianoIcon /> : <PianoOff />}
          </ToggleButton>
          <ToggleButton value="speech" selected={reading} onClick={reading ? cancelSpeech : readSelectedText}>
            <RecordVoiceOver />
          </ToggleButton>
        </StyledToggleButtonGroup>
      </div>
      <Collapse in={pianoOpen} unmountOnExit>
        <Piano setOpen={setPianoOpen} chordsToPlayProvider={getSelectedChords} />
      </Collapse>
      <StyledEditorContent editor={editor} showGrid={showGrid} />
    </div>
  );
};

export default SongEditor;
