import SongTable from './SongTable.tsx';
import { useMemo } from 'react';
import { Category } from '../types/song.types.ts';
import { useParams } from 'react-router';
import { Paper } from '@mui/material';
import { getCategoryDisplayName } from '../category/category.utils.ts';

const SongFullTable = () => {
  const { category: categoryParam } = useParams();

  const category: Category | undefined = useMemo(() => {
    if (categoryParam && Object.values(Category).includes(categoryParam as Category)) {
      return categoryParam as Category;
    }
  }, [categoryParam]);

  return (
    <Paper sx={{ minHeight: '100%', width: '100%' }}>
      <SongTable category={category} title={category && `Piosenki z kategorii "${getCategoryDisplayName(category)}"`} />
    </Paper>
  );
};

export default SongFullTable;
