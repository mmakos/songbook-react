import { AuthorCategory, Category } from '../types/song.types.ts';
import { TSearchCategory } from '../search/search.utils.ts';

const categoryNames: Record<TSearchCategory, string> = {
  [AuthorCategory.BAND]: 'Zespół',
  [AuthorCategory.PERSON]: 'Artysta',
  [AuthorCategory.SOURCE]: 'Źródło',
  [Category.KACZMARSKI]: 'Kaczmarski i Spółka',
  [Category.OTHER]: 'Pozostałe',
  [Category.RELIGIOUS]: 'Religijne',
  [Category.PATRIOTIC]: 'Patriotyczne',
  [Category.CAROLS]: 'Kolędy'
};

const categoryOrder: Record<Category, number> = {
  [Category.KACZMARSKI]: 0,
  [Category.OTHER]: 1,
  [Category.RELIGIOUS]: 2,
  [Category.PATRIOTIC]: 3,
  [Category.CAROLS]: 4,
};

export const getCategoryDisplayName = (category: TSearchCategory) => {
  return categoryNames[category];
};

export const compareCategory = (cat1: Category, cat2: Category) => {
  return categoryOrder[cat1] - categoryOrder[cat2];
};
