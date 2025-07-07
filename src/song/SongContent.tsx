import SongText from './text/SongText.tsx';
import { Box, Collapse, Skeleton, Stack, useTheme } from '@mui/material';
import SongChords from './chord/SongChords.tsx';
import { useAppDispatch } from '../store/songbook.store.ts';
import SongRepetition from './repetition/SongRepetition.tsx';
import ScalableBox from '../components/ScalableBox.tsx';
import { FC, useRef } from 'react';
import { changeZoom } from '../store/songbook.reducer.ts';
import { ISongContent } from '../types/song.types.ts';
import { useSongContext } from './SongContext.tsx';
import useLineHeight from '../store/useLineHeight.hook.ts';

export interface ISongContentProps {
  song?: ISongContent;
  preview?: boolean;
}

const SongContent: FC<ISongContentProps> = ({ song, preview }) => {
  const {
    showChords,
    noChords,
    chordDifficulty,
    zoom,
    font,
    fontStyles: { text },
  } = useSongContext();
  const theme = useTheme();
  const outerBoxRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const lineHeight = useLineHeight();

  return (
    <Box
      color={theme?.palette.text.primary}
      borderRadius={preview ? '4px' : '4px 4px 0 0'}
      sx={{ background: theme?.palette.background.paper, backgroundImage: 'var(--Paper-overlay)' }}
      px={preview ? '1em' : { xs: '1em', md: '2em' }}
      pt={preview ? '0.5em' : { xs: '1em', md: '1.5em' }}
      pb="0.5em"
    >
      <Box
        ref={outerBoxRef}
        lineHeight={`${lineHeight}em`}
        fontFamily={font ? font.fontFamily : theme.typography.fontFamily}
        fontSize={font ? `${font.fontSize}${font.pt ? 'pt' : 'px'}` : (theme.typography.body1.fontSize as string)} // NOSONAR
        fontWeight={text.bold ? 'bold' : 'normal'}
        fontStyle={text.italic ? 'italic' : 'normal'}
        sx={{
          textDecoration: text.underline ? 'underline' : 'none',
        }}
        overflow="auto"
      >
        {song ? (
          <ScalableBox
            display="flex"
            whiteSpace="nowrap"
            outerBoxRef={outerBoxRef}
            zoom={zoom}
            changeZoomPossible={(possible) => dispatch(changeZoom(possible ? 'normal' : undefined))}
          >
            <SongText song={song} />
            <SongRepetition song={song} />
            {!noChords && (
              <Collapse in={showChords} orientation="horizontal">
                <Stack direction="row">
                  <SongChords song={song} chordsType="chords" />
                  {!chordDifficulty.hideAlternativesColumn && <SongChords song={song} chordsType="alternatives" />}
                </Stack>
              </Collapse>
            )}
          </ScalableBox>
        ) : (
          <Stack spacing={1}>
            <Skeleton height="7em" width="20em" variant="rounded" />
            <Skeleton height="4em" width="20em" variant="rounded" />
            <Skeleton height="7em" width="20em" variant="rounded" />
            <Skeleton height="4em" width="20em" variant="rounded" />
            <Skeleton height="7em" width="20em" variant="rounded" />
            <Skeleton height="4em" width="20em" variant="rounded" />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default SongContent;
