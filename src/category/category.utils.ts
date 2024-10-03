import { Category } from '../types/song.types.ts';

const categoryNames: Record<Category, string> = {
  [Category.KACZMARSKI]: 'Kaczmarski i Spółka',
  [Category.OTHER]: 'Popularne',
  [Category.RELIGIOUS]: 'Religijne',
  [Category.PATRIOTIC]: 'Patriotyczne',
  [Category.CAROLS]: 'Kolędy',
};

export const getCategoryDisplayName = (category: Category) => {
  return categoryNames[category];
};
