import SongText from './text/SongText.tsx';
import { Box, Collapse, Skeleton, Stack, useTheme } from '@mui/material';
import SongChords from './chord/SongChords.tsx';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { darkTheme, lightTheme } from '../theme.ts';
import SongRepetition from './repetition/SongRepetition.tsx';
import ScalableBox from '../components/ScalableBox.tsx';
import { useRef } from 'react';
import { changeZoom } from '../store/songbook.reducer.ts';

const SongContent = () => {
  const song = useAppSelector((state) => state.song);
  const showChords = useAppSelector((state) => state.songSettings.showChords);
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const zoom = useAppSelector((state) => state.songDisplayState.zoom);
  const theme = useTheme();
  const appThemeMode = useAppSelector((state) => state.theme);
  const {
    mode,
    font,
    customFont,
    spacing,
    customSpacing,
    fontStyles: { text },
  } = useAppSelector((state) => state.songbookSettings.songTheme);
  const songTheme = mode && (mode === appThemeMode ? undefined : mode === 'light' ? lightTheme : darkTheme);
  const outerBoxRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  return (
    <Box
      color={songTheme?.palette.text.primary}
      borderRadius="4px 4px 0 0"
      sx={{ background: songTheme?.palette.background.default }}
      px={{ xs: '1em', md: '2em' }}
      pt={{ xs: '1em', md: '1.5em' }}
      pb="0.5em"
    >
      <Box
        ref={outerBoxRef}
        lineHeight={customSpacing ? `${spacing.lineHeight}em` : (theme.typography.body1.lineHeight as string)}
        fontFamily={customFont ? font.fontFamily : theme.typography.fontFamily}
        fontSize={customFont ? `${font.fontSize}px` : (theme.typography.body1.fontSize as string)}
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
                <SongChords song={song} />
              </Collapse>
            )}
          </ScalableBox>
        ) : (
          <Stack spacing={1}>
            <Skeleton height="7em" width="20em" variant="rounded"></Skeleton>
            <Skeleton height="4em" width="20em" variant="rounded"></Skeleton>
            <Skeleton height="7em" width="20em" variant="rounded"></Skeleton>
            <Skeleton height="4em" width="20em" variant="rounded"></Skeleton>
            <Skeleton height="7em" width="20em" variant="rounded"></Skeleton>
            <Skeleton height="4em" width="20em" variant="rounded"></Skeleton>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default SongContent;
