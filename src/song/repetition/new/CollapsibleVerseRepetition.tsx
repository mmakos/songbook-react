import { useAppSelector } from '../../../store/songbook.store.ts';
import { FC, useState } from 'react';
import { Collapse } from '@mui/material';
import { ISong, IVerse } from '../../../types/song.types.ts';
import VerseRepetition from './VerseRepetition.tsx';
import useLineHeight from '../../../store/useLineHeight.hook.ts';
import useVerseSpacing from '../../../store/useVerseSpacing.hook.ts';

interface ICollapsibleVerseRepetitionProps {
  verse: IVerse;
  song: ISong;
}

const verseHasRepetition = (verse: IVerse) => {
  for (const line of verse.lines) {
    if (line.repetition) {
      return true;
    }
  }
  return false;
}

const CollapsibleVerseRepetition: FC<ICollapsibleVerseRepetitionProps> = ({ verse, song }) => {
  const { expandVerses } = useAppSelector((state) => state.songDisplayState);
  const [showOriginal, setShowOriginal] = useState(!expandVerses);
  const lineHeight = useLineHeight();
  const verseSpacing = useVerseSpacing();

  const verseRefValid = verse.verseRef !== undefined && verse.verseRef < song.verses.length;

  if ((!showOriginal || expandVerses) && verseRefValid) {
    const referencedVerse = {...song.verses[verse.verseRef!]};
    if (verse.lines.length === 1) {
      const onlyLine = verse.lines[0];
      if (onlyLine.repetitionEnd && !verseHasRepetition(referencedVerse)) {
        referencedVerse.lines = referencedVerse.lines.map((line) => ({...line, repetition: true }));
        referencedVerse.lines[referencedVerse.lines.length - 1].repetitionEnd = onlyLine.repetitionEnd;
      }
    }
    verse = referencedVerse;
  }

  const lastLine = verse.lines[verse.lines.length - 1];
  const repetitionContinues = lastLine.repetition && !lastLine.repetitionEnd; // TODO repetition continuation

  if (!verseRefValid) {
    return (
      <div style={{ marginBottom: `${verseSpacing}em` }}>
        <VerseRepetition verse={verse} />
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
          <VerseRepetition verse={verse} />
        </div>
      </Collapse>
    </div>
  );
};

export default CollapsibleVerseRepetition;
