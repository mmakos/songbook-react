import { AuthorCategory, Category, IBand, IPerson, ISongOverview, ISource } from '../types/song.types.ts';
import { personAsString } from '../author/author.utils.ts';
import { compareCategory } from '../category/category.utils.ts';
import { IFastSearch } from './search.types.ts';

export type TSearchCategory = AuthorCategory | Category;

export interface ISearchItem {
  displayName: string;
  category: TSearchCategory;
  slug: string;
}

export const autocompleteSearchItems = (fastSearch: IFastSearch) => {
  return [
    ...fastSearch.songs.map(songToSearchItem).sort(compareWithCategory),
    ...fastSearch.bands.map(bandToSearchItem).sort(compare),
    ...fastSearch.people.map(personToSearchItem).sort(compare),
    ...fastSearch.sources.map(sourceToSearchItem).sort(compare),
  ];
};

export const getSearchItemUrl = (searchItem: ISearchItem): string => {
  if (searchItem.category === AuthorCategory.SOURCE) {
    return `/source/${searchItem.slug}`;
  } else if (searchItem.category === AuthorCategory.BAND) {
    return `/band/${searchItem.slug}`;
  } else if (searchItem.category === AuthorCategory.PERSON) {
    return `/person/${searchItem.slug}`;
  } else {
    return `/song/${searchItem.slug}`;
  }
};

const bandToSearchItem = (band: IBand): ISearchItem => {
  return {
    displayName: band.name,
    slug: band.slug,
    category: AuthorCategory.BAND,
  };
};

const sourceToSearchItem = (source: ISource): ISearchItem => {
  return {
    displayName: source.name,
    slug: source.slug,
    category: AuthorCategory.SOURCE,
  };
};

const personToSearchItem = (person: IPerson): ISearchItem => {
  return {
    displayName: personAsString(person),
    slug: person.slug,
    category: AuthorCategory.PERSON,
  };
};

const songToSearchItem = (song: ISongOverview): ISearchItem => {
  return {
    displayName: song.title,
    slug: song.slug,
    category: song.category,
  };
};

const compare = (a: ISearchItem, b: ISearchItem) => {
  return a.displayName.localeCompare(b.displayName);
}

const compareWithCategory = (a: ISearchItem, b: ISearchItem) => {
  return compareCategory(a.category as Category, b.category as Category) ?? compare(a, b);
}
