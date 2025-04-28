import { useMemo } from 'react';
import { Category } from '../types/song.types.ts';
import { useParams } from 'react-router';
import { getCategoryDisplayName } from '../category/category.utils.ts';
import SongList from './SongList.tsx';

const SongFullTable = () => {
  const { category: categoryParam } = useParams();

  const category: Category | undefined = useMemo(() => {
    if (categoryParam && Object.values(Category).includes(categoryParam as Category)) {
      return categoryParam as Category;
    }
  }, [categoryParam]);

  return (
    <SongList category={category} title={category && `Piosenki z kategorii "${getCategoryDisplayName(category)}"`} />
  );
};

export default SongFullTable;
