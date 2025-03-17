import { useEditor } from '@tiptap/react';
import { Bold } from '@tiptap/extension-bold';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { HardBreak } from '@tiptap/extension-hard-break';
import { History } from '@tiptap/extension-history';
import StyledEditorContent from './StyledEditorContent.ts';
import Indent from './IndentExtension.ts';
import TextReplacer from './TextReplacer.ts';
import DoubleHardWrapToParagraph from './AutoParExtension.ts';

const content =
  '<p>Gdzie stare młyny dumnie stoją<br>Nad rzeką, której nie zna mapa<br>I choć do domu stąd niedaleko<br>Przewędrujemy kawał świata.</p><p data-indent="1">A u nas latem jest najlepiej,<br>Dywanem w złocie zboże tańczy.<br>I nasze słońce jest najlepsze,<br>Choć u nas nie ma pomarańczy.</p><p>Tam dziadek wiatrak zasłuchany<br>W żabie rechoty gdzieś za lasem.<br>To znowu kamień na rozdrożu<br>Pomylił przeszłość z naszym czasem.</p><p data-indent="1">A u nas latem…</p><p>Wędrować dobrze jest wśród jezior<br>Gdy słońce mówi nam dobranoc.<br>I śmiać się nocą do księżyca,<br>I kłaść się spać dopiero rano. </p><p data-indent="1">A u nas latem…</p><p>Aż przyjdą czasy, gdy ścierniska<br>Śniegi pokryją aż do wiosny.<br>Wtedy igłami nam się skłonią<br>Zawsze zielone polskie sosny.</p><p data-indent="1">A u nas latem…</p>';

const SongTextEditor = () => {
  const editor = useEditor({
    extensions: [
      Text,
      Paragraph,
      HardBreak,
      Document,
      Bold,
      History,
      DoubleHardWrapToParagraph,
      TextReplacer,
      Indent.configure({
        types: ['paragraph'],
        minLevel: 0,
        maxLevel: 3,
      }),
    ],
    content,
  });

  return (
    <>
      {/*<Button onClick={() => applyStyle()}>Bold</Button>*/}
      {/*<StyledEditorContent>*/}
      <StyledEditorContent editor={editor} />
      {/*</StyledEditorContent>*/}
    </>
  );
};

export default SongTextEditor;
