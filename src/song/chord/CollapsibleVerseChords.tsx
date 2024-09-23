import { useAppSelector } from '../../store/songbook.store.ts';
import { FC, useState } from 'react';
import { Collapse } from '@mui/material';
import { ISong, IVerse } from '../../types/song.types.ts';
import VerseChords from './VerseChords.tsx';

interface ICollapsibleVerseChordsProps {
  verse: IVerse;
  song: ISong;
}

const CollapsibleVerseChords: FC<ICollapsibleVerseChordsProps> = ({ verse, song }) => {
  const { expandVerses } = useAppSelector((state) => state.songDisplayState);
  const [showOriginal, setShowOriginal] = useState(!expandVerses);

  const verseRefValid = verse.verseRef && verse.verseRef < song.verses.length;

  if ((!showOriginal || expandVerses) && verseRefValid) {
    verse = song.verses[verse.verseRef];
  }

  if (!verseRefValid) {
    return (
      <div style={{ marginBottom: '0.7em' }}>
        <VerseChords verse={verse} />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '0.7em' }}>
      <Collapse
        in={expandVerses}
        collapsedSize='24px'
        onEntered={() => setShowOriginal(false)}
        onExited={() => setShowOriginal(true)}
      >
        <div>
          <VerseChords verse={verse} />
        </div>
      </Collapse>
    </div>
  );
};

export default CollapsibleVerseChords;
