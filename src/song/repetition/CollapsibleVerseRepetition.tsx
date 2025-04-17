import { useAppSelector } from '../../store/songbook.store.ts';
import { FC, useState } from 'react';
import { Collapse } from '@mui/material';
import { ISongContent, IVerse } from '../../types/song.types.ts';
import VerseRepetition from './VerseRepetition.tsx';
import useLineHeight from '../../store/useLineHeight.hook.ts';
import useVerseSpacing from '../../store/useVerseSpacing.hook.ts';

interface ICollapsibleVerseRepetitionProps {
  verse: IVerse;
  previousVerse?: IVerse;
  song: ISongContent;
}

const verseHasMultipleRepetition = (verse: IVerse) => {
  let hasRepetition = false;
  for (let i = 0; i < verse.lines.length; ++i) {
    const line = verse.lines[i];
    if (line.repetition) {
      if (line.repetitionEnd && i < verse.lines.length - 1) return true;
      hasRepetition = true;
    } else if (hasRepetition) {
      return true;
    }
  }

  return false;
};

const CollapsibleVerseRepetition: FC<ICollapsibleVerseRepetitionProps> = ({ verse, previousVerse, song }) => {
  const { expandVerses } = useAppSelector((state) => state.songDisplayState);
  const [showOriginal, setShowOriginal] = useState(!expandVerses);
  const lineHeight = useLineHeight();
  const verseSpacing = useVerseSpacing();

  const verseRefValid = verse.verseRef !== undefined && verse.verseRef < song.verses.length;

  if ((!showOriginal || expandVerses) && verseRefValid) {
    const referencedVerse = { ...song.verses[verse.verseRef!] };
    if (verse.lines.length === 1) {
      const onlyLine = verse.lines[0];
      if (onlyLine.repetitionEnd && !verseHasMultipleRepetition(referencedVerse)) {
        referencedVerse.lines = referencedVerse.lines.map((line) => ({ ...line, repetition: true }));
        referencedVerse.lines[referencedVerse.lines.length - 1].repetitionEnd = onlyLine.repetitionEnd;
      }
    }
    verse = referencedVerse;
  }

  if (!verseRefValid) {
    return <VerseRepetition verse={verse} previousVerse={previousVerse} />;
  }

  return (
      <Collapse
        in={expandVerses}
        collapsedSize={`${lineHeight + verseSpacing}em`}
        onEntered={() => setShowOriginal(false)}
        onExited={() => setShowOriginal(true)}
      >
        <div>
          <VerseRepetition verse={verse} previousVerse={previousVerse} />
        </div>
      </Collapse>
  );
};

export default CollapsibleVerseRepetition;
