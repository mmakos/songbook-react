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
import Piano from '../piano/Piano.tsx';
import { Collapse, ToggleButton } from '@mui/material';
import { useState } from 'react';
import {
  Grid4x4,
  Looks3,
  LooksOne,
  LooksTwo,
  Lyrics,
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
import {
  ChordStrike,
  ChordSubscript,
  ChordSuperscript,
  ExclusiveBold,
  ExclusiveItalic,
  ExclusiveUnderline,
} from './ExclusiveStyle.ts';
import TypedTableCell from './TypedTableCell.ts';
import { dzieciHioba } from './test/dzieci-hioba.json.ts';
import ParagraphRowTable from './ParagraphRowTable.ts';
import UnmodifiableTableHeader from './UnmodifiableTableHeader.ts';
import PreventCellDrag from './PreventTableDrag.ts';
import InsertRowBottom from './icon/InsertRowBottom.tsx';
import InsertChordColumn from './icon/InsertChordColumn.tsx';
import DeleteRow from './icon/DeleteRow.tsx';
import StyledToggleButtonGroup, { StyledToggleButtonGroupDivider } from '../components/StyledToggleButtonGroup.tsx';
import RemoveColumn from './icon/RemoveColumn.tsx';
import InsertRepetitionColumn from './icon/InsertRepetitionColumn.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';
import TextButtonIcon from '../components/icon/TextButtonIcon.tsx';
import Shortcut from '../components/Shortcut.tsx';

const SongEditor = () => {
  const editor = useEditor({
    extensions: [
      Text,
      Paragraph,
      Document,
      ExclusiveBold,
      ExclusiveItalic,
      ExclusiveUnderline,
      ChordSubscript,
      ChordSuperscript,
      ChordStrike,
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
  const [pianoOpen, setPianoOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [repetitionColumn, setRepetitionColumn] = useState(false);
  const [additionalChordColumn, setAdditionalChordColumn] = useState(false);
  const [commentsColumn, setCommentsColumn] = useState(false);

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
    const { content } = editor.state.selection.content();
    const text = content.size ? content.textBetween(0, content.size) : editor.getText();
    setReading(true);
    readText(text, () => setReading(false));
  };

  const handleAdditionalChordColumn = () => {
    if (additionalChordColumn) {
      editor
        ?.chain()
        .focus()
        .removeColumn(commentsColumn ? -2 : -1)
        .run();
    } else {
      editor
        ?.chain()
        .focus()
        .addColumn(commentsColumn ? -2 : -1, '', { cellType: 'chord' }, true)
        .run();
    }
    setAdditionalChordColumn(!additionalChordColumn);
  };

  const handleRepetitionColumn = () => {
    if (repetitionColumn) {
      editor?.chain().focus().removeColumn(1).run();
    } else {
      editor?.chain().focus().addColumn(1, '|x2', { cellType: 'repetition' }).run();
    }
    setRepetitionColumn(!repetitionColumn);
  };

  const handleCommentsColumn = () => {
    if (commentsColumn) {
      editor?.chain().focus().removeColumn(-1).run();
    } else {
      editor?.chain().focus().addColumn(-1, 'Komentarze', { cellType: 'comment' }).run();
    }
    setCommentsColumn(!commentsColumn);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
      <div style={{ display: 'flex' }}>
        <StyledToggleButtonGroup size="small">
          <BasicTooltip
            title={
              <>
                <em>Tekst specjalny 1</em> <Shortcut baseKey="I" mod />
              </>
            }
          >
            <ToggleButton
              value="1"
              selected={editor?.isActive('italic')}
              onClick={() => editor?.chain().focus().toggleItalic('text').run()}
              disabled={!editor?.can().toggleItalic('text')}
            >
              <LooksOne />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip
            title={
              <>
                <u>Tekst specjalny 2</u> <Shortcut baseKey="U" mod />
              </>
            }
          >
            <ToggleButton
              value="2"
              selected={editor?.isActive('underline')}
              onClick={() => editor?.chain().focus().toggleUnderline('text').run()}
              disabled={!editor?.can().toggleUnderline('text')}
            >
              <LooksTwo />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip
            title={
              <>
                <strong>Tekst specjalny 3</strong> <Shortcut baseKey="B" mod />
              </>
            }
          >
            <ToggleButton
              value="3"
              selected={editor?.isActive('bold')}
              onClick={() => editor?.chain().focus().toggleBold('text').run()}
              disabled={!editor?.can().toggleBold('text')}
            >
              <Looks3 />
            </ToggleButton>
          </BasicTooltip>
        </StyledToggleButtonGroup>
        <StyledToggleButtonGroupDivider />
        <StyledToggleButtonGroup size="small">
          <BasicTooltip
            title={
              <>
                Dodatkowe składniki <Shortcut baseKey="." mod />
              </>
            }
          >
            <ToggleButton
              value="additional"
              selected={editor?.isActive('chordSuperscript')}
              onClick={() => editor?.chain().focus().toggleSuperscript().run()}
              disabled={!editor?.can().toggleSuperscript()}
            >
              <TextButtonIcon>
                E<sup>7</sup>
              </TextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip
            title={
              <>
                Składnik w basie <Shortcut baseKey="," mod />
              </>
            }
          >
            <ToggleButton
              value="base"
              selected={editor?.isActive('chordSubscript')}
              onClick={() => editor?.chain().focus().toggleSubscript().run()}
              disabled={!editor?.can().toggleSubscript()}
            >
              <TextButtonIcon>
                E<sub>3</sub>
              </TextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip
            title={
              <>
                <em>Akordy "ciche" (harmonia a cappella)</em> <Shortcut baseKey="I" mod />
              </>
            }
          >
            <ToggleButton
              value="3"
              selected={editor?.isActive('bold')}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor?.can().toggleItalic('chord')}
            >
              <TextButtonIcon>
                <em>E</em>
              </TextButtonIcon>
            </ToggleButton>
          </BasicTooltip>
        </StyledToggleButtonGroup>
        <StyledToggleButtonGroupDivider />
        <StyledToggleButtonGroup size="small">
          <BasicTooltip
            title={
              <>
                Dodaj zwrotkę poniżej <Shortcut baseKey="Enter" shift />, <Shortcut baseKey="Enter" mod />
              </>
            }
          >
            <ToggleButton
              value="insertRowAfter"
              onClick={() => editor?.chain().focus().addRowAfter().run()}
              disabled={!editor?.can().addRowAfter()}
            >
              <InsertRowBottom />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title="Usuń zwrotkę">
            <ToggleButton
              value="deleteRow"
              onClick={() => editor?.chain().focus().deleteRow().run()}
              disabled={!editor?.can().deleteRow()}
            >
              <DeleteRow />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title={`${repetitionColumn ? 'Usuń' : 'Dodaj'} kolumnę z powtórzeniami`}>
            <ToggleButton value="addRepetitionColumn" onClick={handleRepetitionColumn} selected={repetitionColumn}>
              {repetitionColumn ? <RemoveColumn transform="scale(-1,1)" /> : <InsertRepetitionColumn />}
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title={`${additionalChordColumn ? 'Usuń' : 'Dodaj'} kolumnę z alternatywnymi akordami`}>
            <ToggleButton
              value="addChordsColumn"
              onClick={handleAdditionalChordColumn}
              selected={additionalChordColumn}
            >
              {additionalChordColumn ? <RemoveColumn /> : <InsertChordColumn />}
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title={`${commentsColumn ? 'Usuń' : 'Dodaj'} kolumnę komentarzy wykonawczych`}>
            <ToggleButton value="addCommentsColumn" onClick={handleCommentsColumn} selected={commentsColumn}>
              <Lyrics />
            </ToggleButton>
          </BasicTooltip>
        </StyledToggleButtonGroup>
        <StyledToggleButtonGroupDivider />
        <StyledToggleButtonGroup size="small">
          <BasicTooltip
            title={
              <>
                Cofnij <Shortcut baseKey="Z" mod />
              </>
            }
          >
            <ToggleButton
              value="undo"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
            >
              <Undo />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip
            title={
              <>
                Przywróć <Shortcut baseKey="Z" mod shift />, <Shortcut baseKey="Y" mod />
              </>
            }
          >
            <ToggleButton
              value="redo"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
            >
              <Redo />
            </ToggleButton>
          </BasicTooltip>
        </StyledToggleButtonGroup>
        <StyledToggleButtonGroupDivider />
        <StyledToggleButtonGroup size="small">
          <BasicTooltip title="Pokaż linie siatki">
            <ToggleButton value="showGrid" selected={showGrid} onChange={() => setShowGrid(!showGrid)}>
              <Grid4x4 />
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title={`${pianoOpen ? 'Ukryj' : 'Pokaż'} klawiaturę pianina`}>
            <ToggleButton value="piano" selected={pianoOpen} onClick={() => setPianoOpen(!pianoOpen)}>
              {pianoOpen ? <PianoIcon /> : <PianoOff />}
            </ToggleButton>
          </BasicTooltip>
          <BasicTooltip title={reading ? 'Zatrzymaj czytanie tekstu' : 'Przeczytaj tekst'}>
            <ToggleButton value="speech" selected={reading} onClick={reading ? cancelSpeech : readSelectedText}>
              <RecordVoiceOver />
            </ToggleButton>
          </BasicTooltip>
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
