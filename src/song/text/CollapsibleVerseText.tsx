import { FC, useState } from 'react';
import { ISong, IVerse } from '../../types/song.types.ts';
import { Collapse, Fade, IconButton } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import VerseText from './VerseText.tsx';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { setExpandVerses, setHoverExpandVerses } from '../../store/songbook.reducer.ts';

interface ICollapsibleVerseTextProps {
  verse: IVerse;
  song: ISong;
}

const CollapsibleVerseText: FC<ICollapsibleVerseTextProps> = ({ verse, song }) => {
  const { expandVerses, hoverExpandVerses } = useAppSelector((state) => state.songDisplayState);
  const [showOriginal, setShowOriginal] = useState(!expandVerses);
  const dispatch = useAppDispatch();

  const verseRefValid = verse.verseRef && verse.verseRef < song.verses.length;

  if ((!showOriginal || expandVerses) && verseRefValid) {
    verse = song.verses[verse.verseRef];
  }

  if (!verseRefValid) {
    return (
      <div style={{ marginLeft: verse.indent * 2 + 'em', marginBottom: '0.7em' }}>
        <VerseText verse={verse} />
      </div>
    );
  }

  const handleExpand = () => {
    dispatch(setExpandVerses(!expandVerses));
  };

  return (
    <div
      style={{
        display: 'flex',
        marginBottom: '0.7em',
        marginLeft: `calc(${verse.indent * 2}em - 24px - 0.3em)`,
        alignItems: 'start',
      }}
      onMouseEnter={() => dispatch(setHoverExpandVerses(true))}
      onMouseLeave={() => dispatch(setHoverExpandVerses(false))}
    >
      <Fade in={hoverExpandVerses}>
        <IconButton onClick={handleExpand} sx={{ padding: 0, mr: '0.3em' }} color="inherit">
          <ExpandMore
            sx={{
              rotate: expandVerses ? '0deg' : '-90deg',
              transitionProperty: 'rotate',
              transitionDuration: '1sec',
            }}
          />
        </IconButton>
      </Fade>
      <Collapse
        in={expandVerses}
        collapsedSize="24px"
        onEntered={() => setShowOriginal(false)}
        onExited={() => setShowOriginal(true)}
      >
        <div>
          <VerseText verse={verse} />
        </div>
      </Collapse>
    </div>
  );
};

export default CollapsibleVerseText;
