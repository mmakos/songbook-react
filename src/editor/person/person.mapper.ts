import { IAuthorEdit, IPersonData, IPersonOverview } from '../../types/song.types.ts';
import { parsePersonName } from '../../author/author.utils.ts';

export type IEditedPerson = IPersonData & { id: string };

export const personToPersonData = (person: IPersonData): IPersonData => ({
  name: person.name,
  secondName: person.secondName,
  lastName: person.lastName,
  nickname: person.nickname,
  url: person.url,
  forceNickname: person.forceNickname,
  forceSecondName: person.forceSecondName,
});

export const splitToNewAndExistingPerson = (
  people: (IPersonOverview | string)[],
  cache: Record<string, IPersonOverview>,
  current?: IAuthorEdit<IEditedPerson>
): IAuthorEdit<IEditedPerson> | undefined => {
  const news: IEditedPerson[] = [];
  const existing: string[] = [];
  for (const person of people) {
    if (typeof person === 'string') {
      const currentNew = current?.new?.find((e) => e.id === person);
      news.push(currentNew ?? { ...parsePersonName(person), id: person });
    } else {
      cache[person.slug] = person;
      existing.push(person.slug);
    }
  }
  const result: IAuthorEdit<IEditedPerson> = {};
  if (news.length) result.new = news;
  if (existing.length) result.existing = existing;

  if (Object.keys(result).length) return result;
};

export const getPersonFromSongEdit = (
  cache: Record<string, IPersonOverview>,
  personEdit?: IAuthorEdit<IEditedPerson>,
  songPerson?: IPersonOverview[]
): (IPersonOverview | string)[] => {
  const result: (IPersonOverview | string)[] = [];
  personEdit?.existing?.forEach((e) => {
    let found: IPersonOverview | undefined = cache[e];
    if (!found) found = songPerson?.find((s) => s.slug === e);
    found && result.push(found);
  });
  personEdit?.new?.forEach((n) => result.push(n.id));
  return result;
};
