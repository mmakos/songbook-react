import { Category } from '../types/song.types.ts';

const categoryNames: Record<Category, string> = {
  [Category.KACZMARSKI]: 'Kaczmarski i Spółka',
  [Category.OTHER]: 'Popularne',
  [Category.RELIGIOUS]: 'Religijne',
  [Category.PATRIOTIC]: 'Patriotyczne',
  [Category.CAROLS]: 'Kolędy',
};

const categoryOrder: Record<Category, number> = {
  [Category.KACZMARSKI]: 0,
  [Category.OTHER]: 1,
  [Category.RELIGIOUS]: 2,
  [Category.PATRIOTIC]: 3,
  [Category.CAROLS]: 4,
};

export const getCategoryDisplayName = (category: Category) => {
  return categoryNames[category];
};

export const compareCategory = (cat1: Category, cat2: Category) => {
  return categoryOrder[cat1] - categoryOrder[cat2];
};
