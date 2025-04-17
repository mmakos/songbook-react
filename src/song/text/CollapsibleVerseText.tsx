import { FC, useState } from 'react';
import { ISongContent, IVerse } from '../../types/song.types.ts';
import { alpha, Collapse, Fade, IconButton, styled } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import VerseText from './VerseText.tsx';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { initialSpacing, setExpandVerses, setHoverExpandVerses } from '../../store/songbook.reducer.ts';
import useLineHeight from '../../store/useLineHeight.hook.ts';

interface ICollapsibleVerseTextProps {
  verse: IVerse;
  song: ISongContent;
}

const IconBackground = styled('span')(({ theme }) => ({
  position: 'absolute',
  fontSize: 'unset',
  background: alpha(theme.palette.background.paper, 0.8),
  backgroundImage: 'var(--Paper-overlay)',
  lineHeight: 1,
}));

const CollapsibleVerseText: FC<ICollapsibleVerseTextProps> = ({ verse, song }) => {
  const { expandVerses, hoverExpandVerses } = useAppSelector((state) => state.songDisplayState);
  let spacing = useAppSelector((state) => state.songbookSettings.songTheme.spacing);
  const customSpacing = useAppSelector((state) => state.songbookSettings.songTheme.customSpacing);
  const [showOriginal, setShowOriginal] = useState(!expandVerses);
  const dispatch = useAppDispatch();

  if (!customSpacing) {
    spacing = initialSpacing;
  }

  const lineHeight = useLineHeight();

  const indent = verse.indent;
  const verseRefValid = verse.verseRef !== undefined && verse.verseRef < song.verses.length;

  if ((!showOriginal || expandVerses) && verseRefValid) {
    verse = song.verses[verse.verseRef!];
  }

  if (!verseRefValid) {
    return (
      <div
        style={{
          marginLeft: verse.indent * (spacing?.verseIndent ?? 3) + 'ch',
          marginBottom: `${spacing.verseSpacing}em`,
        }}
      >
        <VerseText verse={verse} />
      </div>
    );
  }

  const handleExpand = () => {
    dispatch(setExpandVerses(!expandVerses));
  };

  return (
    <div // NOSONAR
      style={{
        display: 'flex',
        marginBottom: spacing?.verseSpacing ? `${spacing.verseSpacing}em` : '0.7em',
        marginLeft: `${indent * (spacing?.verseIndent ?? 3)}ch`,
        cursor: 'pointer',
      }}
      onMouseEnter={() => dispatch(setHoverExpandVerses(true))}
      onMouseLeave={() => dispatch(setHoverExpandVerses(false))}
      onClick={handleExpand}
    >
      <Fade in={hoverExpandVerses}>
        <IconBackground sx={{ left: `calc(max(${indent * (spacing?.verseIndent ?? 3)}ch - ${lineHeight}em, 0em))` }}>
          <IconButton
            onClick={handleExpand}
            sx={{
              padding: 0,
            }}
            color="inherit"
          >
            <ExpandMore
              sx={{
                rotate: expandVerses ? '0deg' : '-90deg',
                transitionProperty: 'rotate',
                transitionDuration: '1sec',
              }}
            />
          </IconButton>
        </IconBackground>
      </Fade>
      <Collapse
        in={expandVerses}
        collapsedSize={`${lineHeight}em`}
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
