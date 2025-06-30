import { useMemo } from 'react';
import { Category } from '../types/song.types.ts';
import { useParams } from 'react-router';
import SongList from './SongList.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';

const categorySongsName = (category?: Category) => {
  if (!category) return 'Lista piosenek';
  switch (category) {
    case 'kaczmarski':
      return 'Piosenki kaczmarskiego';
    case 'other':
      return 'Pozostałe piosenki';
    case 'patriotic':
      return 'Pieśni patriotyczne';
    case 'religious':
      return 'Pieśni religijne';
    case 'carols':
      return 'Kolędy';
  }
};

const SongFullTable = () => {
  const { category: categoryParam } = useParams();

  const category: Category | undefined = useMemo(() => {
    if (categoryParam && Object.values(Category).includes(categoryParam as Category)) {
      return categoryParam as Category;
    }
  }, [categoryParam]);

  const catName = categorySongsName(category);

  return (
    <>
      <BasicHelmet title={catName} />
      <SongList category={category} title={catName} />
    </>
  );
};

export default SongFullTable;
