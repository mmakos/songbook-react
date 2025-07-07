import { useEditor } from '@tiptap/react';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { History } from '@tiptap/extension-history';
import Indent from './IndentExtension.ts';
import InputRules from './InputRules.ts';
import { TableRow } from '@tiptap/extension-table-row';
import songToHTML from '../converter/songToHTML.converter.ts';
import Piano from '../../piano/Piano.tsx';
import { Button, Collapse, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  Autorenew,
  BackspaceOutlined,
  Check,
  ErrorOutline,
  FormatIndentDecrease,
  FormatIndentIncrease,
  FormatStrikethrough,
  Grid4x4,
  ImageOutlined,
  Looks3,
  LooksOne,
  LooksTwo,
  Lyrics,
  Piano as PianoIcon,
  PianoOff,
  PublishedWithChanges,
  RecordVoiceOver,
  Redo,
  Reorder,
  Report,
  Sync,
  Undo,
  VerticalSplitOutlined,
} from '@mui/icons-material';
import { IChord, ISongContent, IVerse, NoteBase } from '../../types/song.types.ts';
import { extractChordsFromFragment, flattenChords, rootNodeToSong } from '../converter/htmlToSong.converter.ts';
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
import ParagraphRowTable from './ParagraphRowTable.ts';
import UnmodifiableTableHeader from './UnmodifiableTableHeader.ts';
import PreventCellDrag from './PreventTableDrag.ts';
import InsertRowBottom from '../icon/InsertRowBottom.tsx';
import InsertChordColumn from '../icon/InsertChordColumn.tsx';
import DeleteRow from '../icon/DeleteRow.tsx';
import RemoveColumn from '../icon/RemoveColumn.tsx';
import InsertRepetitionColumn from '../icon/InsertRepetitionColumn.tsx';
import BasicTooltip from '../../components/BasicTooltip.tsx';
import TextButtonIcon from '../../components/icon/TextButtonIcon.tsx';
import Shortcut from '../../components/Shortcut.tsx';
import TitledToggleButtonGroup, { TitledToggleButtonGroupDivider } from '../components/TitledToggleButtonGroup.tsx';
import StyledSongContent from '../components/StyledSongContent.tsx';
import StyledEditorContent from '../components/StyledEditorContent.ts';
import SplitPane from '../../components/SplitPane.tsx';
import { useSongEditContext } from '../SongEditContext.tsx';
import SongKeysChooser from './SongKeysChooser.tsx';
import SongTablePaste from './SongTablePaste.ts';
import GlobalSongContent from '../../song/GlobalSongContent.tsx';

type TPreviewType = 'editor' | 'split' | 'preview';

const SongEditor = () => {
  const { updateStep, setSongEdit, songEdit, textEdit, setTextEdit, keyEdit, setKeyEdit, newSong } =
    useSongEditContext();

  const [songEditContent, repetitions, alternatives, comments] = useMemo(() => songToHTML(songEdit.verses), []);

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
      InputRules,
      Indent,
      PreventCellDrag,
      SongTablePaste,
    ],
    content: songEditContent,
  });
  const [pianoOpen, setPianoOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [repetitionColumn, setRepetitionColumn] = useState(repetitions);
  const [additionalChordColumn, setAdditionalChordColumn] = useState(alternatives);
  const [commentsColumn, setCommentsColumn] = useState(comments);
  const [previewType, setPreviewType] = useState<TPreviewType>('split');
  const [previewSong, setPreviewSong] = useState<ISongContent>({ verses: songEdit.verses });
  const [songbookKeyError, setSongbookKeyError] = useState(false);

  const selectedEdits = useMemo(() => {
    const edits = [];
    keyEdit && edits.push('key');
    textEdit && edits.push('text');
    return edits;
  }, [keyEdit, textEdit]);

  const getSelectedChords = (): IChord[] | undefined => {
    if (!editor) return;
    const slice = editor.state.selection.content();
    return flattenChords(extractChordsFromFragment(slice.content, editor.schema));
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

  const updateFromPreview = () => {
    editor?.commands.setContent(songToHTML(previewSong.verses));
  };

  const updatePreview = () => {
    if (editor) {
      const verses: IVerse[] = rootNodeToSong(editor.$doc.node, editor.schema);
      setPreviewSong({ verses });
    }
  };

  const updateEditor = () => {
    if (editor) {
      editor.commands.setContent(songToHTML(rootNodeToSong(editor.$doc.node, editor.schema)));
    }
  };

  const validate = () => {
    if (!songEdit.key?.songbook && keyEdit) {
      setSongbookKeyError(true);
      return false;
    }
    return true;
  };

  const handleStepChange = (inc: number) => {
    if (inc > 0 && !validate()) return;
    editor && setSongEdit({ ...songEdit, verses: rootNodeToSong(editor.$doc.node, editor.schema) });
    updateStep(inc);
  };

  const handleSelectedEditsChange = (edits: string[]) => {
    setKeyEdit(edits.includes('key'));
    setTextEdit(edits.includes('text'));
  };

  return (
    <Stack>
      <Stack direction="row" justifyContent={newSong ? 'right' : 'space-between'} my="1em">
        {!newSong && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <ToggleButtonGroup
              color="primary"
              value={selectedEdits}
              onChange={(_, value) => handleSelectedEditsChange(value)}
            >
              <ToggleButton value="key">Edytuj tonację</ToggleButton>
              <ToggleButton value="text">Edytuj tekst i akordy</ToggleButton>
            </ToggleButtonGroup>
            <BasicTooltip title="Jeśli odznaczysz którąś z opcji, to rezugnujesz z edycji danego fragmentu (nawet jeśli wprowadziłeś zmiany).">
              <ErrorOutline color="warning" />
            </BasicTooltip>
          </Stack>
        )}
        <Stack direction="row" gap={1}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => handleStepChange(-1)}
            startIcon={<BackspaceOutlined />}
          >
            Wróć
          </Button>
          <Button variant="contained" size="large" onClick={() => handleStepChange(1)} endIcon={<Check />}>
            Dalej
          </Button>
        </Stack>
      </Stack>
      <Collapse in={keyEdit}>
        <div style={{ marginBottom: '1em' }}>
          <SongKeysChooser songbookKeyError={songbookKeyError} />
        </div>
      </Collapse>
      <Collapse in={textEdit}>
        <Collapse in={pianoOpen}>
          <Piano
            setOpen={setPianoOpen}
            chordsToPlayProvider={getSelectedChords}
            chordsKey={songEdit.key?.songbook ?? { note: { base: NoteBase.C } }}
          />
        </Collapse>
        <Stack direction="row">
          <TitledToggleButtonGroup size="small" title="Tekst">
            <BasicTooltip
              title={
                <>
                  <em>Tekst specjalny 1</em> <Shortcut baseKey="I" mod />
                </>
              }
              span
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
              span
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
              span
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
            <BasicTooltip
              title={
                <>
                  Zmniejsz wcięcie <Shortcut baseKey="Tab" shift />
                </>
              }
              span
            >
              <ToggleButton
                value="outdent"
                onClick={() => editor?.chain().focus().outdent().run()}
                disabled={!editor?.can().outdent()}
              >
                <FormatIndentDecrease />
              </ToggleButton>
            </BasicTooltip>
            <BasicTooltip
              title={
                <>
                  Zwiększ wcięcie <Shortcut baseKey="Tab" />
                </>
              }
              span
            >
              <ToggleButton
                value="indent"
                onClick={() => editor?.chain().focus().indent().run()}
                disabled={!editor?.can().indent()}
              >
                <FormatIndentIncrease />
              </ToggleButton>
            </BasicTooltip>
          </TitledToggleButtonGroup>
          <TitledToggleButtonGroupDivider />
          <TitledToggleButtonGroup size="small" title="Akordy">
            <BasicTooltip
              title={
                <>
                  Dodatkowe składniki <Shortcut baseKey="." mod />
                </>
              }
              span
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
              span
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
              span
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
            <BasicTooltip
              title={
                <>
                  Dźwięki wyłączone (akord bez prymy) <Shortcut baseKey="S" mod shift />
                </>
              }
              span
            >
              <ToggleButton
                value="3"
                selected={editor?.isActive('bold')}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={!editor?.can().toggleItalic('chord')}
              >
                <FormatStrikethrough />
              </ToggleButton>
            </BasicTooltip>
          </TitledToggleButtonGroup>
          <TitledToggleButtonGroupDivider />
          <TitledToggleButtonGroup size="small" title="Struktura piosenki">
            <BasicTooltip
              title={
                <>
                  Dodaj zwrotkę poniżej <Shortcut baseKey="Enter" shift />, <Shortcut baseKey="Enter" mod />
                </>
              }
              span
            >
              <ToggleButton
                value="insertRowAfter"
                onClick={() => editor?.chain().focus().addRowAfter().run()}
                disabled={!editor?.can().addRowAfter()}
              >
                <InsertRowBottom />
              </ToggleButton>
            </BasicTooltip>
            <BasicTooltip title="Usuń zwrotkę" span>
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
          </TitledToggleButtonGroup>
          <TitledToggleButtonGroupDivider />
          <TitledToggleButtonGroup size="small" title="Edycja">
            <BasicTooltip
              title={
                <>
                  Cofnij <Shortcut baseKey="Z" mod />
                </>
              }
              span
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
              span
            >
              <ToggleButton
                value="redo"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
              >
                <Redo />
              </ToggleButton>
            </BasicTooltip>
          </TitledToggleButtonGroup>
          <TitledToggleButtonGroupDivider />
          <TitledToggleButtonGroup size="small" title="Dodatki">
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
          </TitledToggleButtonGroup>
          <TitledToggleButtonGroupDivider />
          <TitledToggleButtonGroup
            size="small"
            exclusive
            value={previewType}
            onChange={(_, prev: TPreviewType) => prev && setPreviewType(prev)}
            title="Podgląd"
          >
            <BasicTooltip title="Edytor">
              <ToggleButton value="editor">
                <Reorder />
              </ToggleButton>
            </BasicTooltip>
            <BasicTooltip title="Edytor i podgląd">
              <ToggleButton value="split">
                <VerticalSplitOutlined />
              </ToggleButton>
            </BasicTooltip>
            <BasicTooltip title="Podgląd">
              <ToggleButton value="preview">
                <ImageOutlined />
              </ToggleButton>
            </BasicTooltip>
          </TitledToggleButtonGroup>
          <TitledToggleButtonGroupDivider />
          <TitledToggleButtonGroup
            title="Parser"
            icon={
              <BasicTooltip
                title={
                  <>
                    Uwaga, te operacje ingerują w treść piosenki. Upewnij się (na podglądzie), że nie utracisz swojej
                    pracy. Zawsze możesz cofnąć operację (
                    <Shortcut baseKey="Z" mod shift />)
                  </>
                }
              >
                <Report fontSize="inherit" color="error" />
              </BasicTooltip>
            }
          >
            <BasicTooltip title="Odśwież podgląd" span>
              <ToggleButton value="sync" disabled={previewType === 'editor'} onClick={updatePreview}>
                <Autorenew />
              </ToggleButton>
            </BasicTooltip>
            <BasicTooltip title="Zaktualizuj edytor na bazie podglądu" span>
              <ToggleButton value="update" disabled={previewType === 'editor'} onClick={updateFromPreview}>
                <Sync />
              </ToggleButton>
            </BasicTooltip>
            <BasicTooltip title="Parsuj i aktualizuj edytor" span>
              <ToggleButton value="update" disabled={previewType === 'preview'} onClick={updateEditor}>
                <PublishedWithChanges />
              </ToggleButton>
            </BasicTooltip>
          </TitledToggleButtonGroup>
          <TitledToggleButtonGroupDivider />
        </Stack>
        <SplitPane
          initial={65}
          left={previewType !== 'preview' && <StyledEditorContent editor={editor} showGrid={showGrid} />}
          right={
            previewType !== 'editor' && (
              <StyledSongContent>
                <GlobalSongContent song={previewSong} />
              </StyledSongContent>
            )
          }
        />
      </Collapse>
      <Typography variant="caption" color="info" mt="2em">
        Uwaga! Niniejszy edytor jest zwykłym edytorem tekstowym zorientowanym na edycję tekstu i akordów w formacie
        używanym w moim śpiewniku. Oznacza to, że posiada on kilka automatyzacji ułatwiających wpisywanie akordów oraz
        kilka blokad uniemożliwiających wprowadzenie danych kompletnie bez sensu. Nie gwarantuje jednak, że wszytko co
        da się wprowadzić, zostanie poprawnie sparsowane. To <u>Twoją odpowiedzialnością</u> jest trzymanie się
        poprawnej struktury. W każdej chwili możesz zobaczyć podgląd piosenki po parsowaniu. Parser jest dość
        elastyczny, więc w większości przypadków niepoprawne elementy zostaną po prostu odrzucone. Możesz również
        zaktualizować edytor na podstawie sparsowanej piosenki (edytor wyrówna się z podglądem).
      </Typography>
    </Stack>
  );
};

export default SongEditor;
