import { useAppSelector } from '../../store/songbook.store.ts';
import { FC, useState } from 'react';
import { Collapse } from '@mui/material';
import { ISong, IVerse } from '../../types/song.types.ts';
import VerseChords from './VerseChords.tsx';
import useLineHeight from '../../store/useLineHeight.hook.ts';
import useVerseSpacing from '../../store/useVerseSpacing.hook.ts';

interface ICollapsibleVerseChordsProps {
  verse: IVerse;
  song: ISong;
}

const CollapsibleVerseChords: FC<ICollapsibleVerseChordsProps> = ({ verse, song }) => {
  const { expandVerses } = useAppSelector((state) => state.songDisplayState);
  const [showOriginal, setShowOriginal] = useState(!expandVerses);
  const lineHeight = useLineHeight();
  const verseSpacing = useVerseSpacing();

  const verseRefValid = verse.verseRef !== undefined && verse.verseRef < song.verses.length;

  if ((!showOriginal || expandVerses) && verseRefValid) {
    verse = song.verses[verse.verseRef!];
  }

  if (!verseRefValid) {
    return (
      <div style={{ marginBottom: `${verseSpacing}em` }}>
        <VerseChords verse={verse} />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: `${verseSpacing}em` }}>
      <Collapse
        in={expandVerses}
        collapsedSize={`${lineHeight}em`}
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
