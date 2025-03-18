import SongTextEditor from './SongTextEditor.tsx';
import SongChordsEditor from './SongChordsEditor.tsx';
import songToHTML from './converter/songToHTML.converter.ts';
import { dzieciHioba } from './test/dzieci-hioba.json.ts';

const SongEditor = () => {
  const [text, chords] = songToHTML(dzieciHioba);

  return (
    <div style={{ display: 'flex', gap: '1em' }}>
      <SongTextEditor text={text}/>
      <SongChordsEditor chords={chords}/>
    </div>
  );
};

export default SongEditor;
