import { useAppSelector } from '../../store/songbook.store.ts';
import { FC, useState } from 'react';
import { Collapse } from '@mui/material';
import {IChords, ISongContent, IVerse} from '../../types/song.types.ts';
import VerseChords from './VerseChords.tsx';
import useLineHeight from '../../store/useLineHeight.hook.ts';
import useVerseSpacing from '../../store/useVerseSpacing.hook.ts';

interface ICollapsibleVerseChordsProps {
  verse: IVerse;
  song: ISongContent;
  chordsType: keyof IChords;
}

const CollapsibleVerseChords: FC<ICollapsibleVerseChordsProps> = ({ verse, song, chordsType }) => {
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
        <VerseChords verse={verse} chordsType={chordsType} />
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
          <VerseChords verse={verse} chordsType={chordsType} />
        </div>
      </Collapse>
    </div>
  );
};

export default CollapsibleVerseChords;
