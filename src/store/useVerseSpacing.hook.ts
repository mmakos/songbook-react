import { initialSpacing } from './songbook.reducer.ts';
import { useSongContext } from '../song/SongContext.tsx';

const useVerseSpacing = (): number => {
  const { spacing } = useSongContext();
  return spacing ? spacing.verseSpacing : initialSpacing.verseSpacing;
};

export default useVerseSpacing;
