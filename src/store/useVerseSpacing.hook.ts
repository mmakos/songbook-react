import { initialSpacing } from './songbook.reducer.ts';
import { useSongContext } from '../song/SongContext.tsx';

const useVerseSpacing = (): `${number}${'pt' | 'em'}` => {
  const { spacing } = useSongContext();
  const verseSpacing = spacing ? spacing.verseSpacing : initialSpacing.verseSpacing;
  return `${verseSpacing}${spacing?.pt ? 'pt' : 'em'}`;
};

export default useVerseSpacing;
