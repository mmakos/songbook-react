import { useAppSelector } from './songbook.store.ts';
import { initialSongbookState } from './songbook.reducer.ts';

const useVerseSpacing = (): number => {
  const verseSpacing = useAppSelector((state) => state.songbookSettings.songTheme.spacing.verseSpacing);
  const customSpacing = useAppSelector((state) => state.songbookSettings.songTheme.customSpacing);
  return customSpacing ? verseSpacing : initialSongbookState.songbookSettings.songTheme.spacing.verseSpacing;
};

export default useVerseSpacing;
