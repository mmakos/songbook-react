import { IPerson } from '../types/song.types.ts';

export const personAsString = (person: IPerson): string => {
  if (person.nickname && (person.forceNickname || person.nickname.includes(' '))) {
    return person.nickname;
  }
  let name = person.name + ' ';
  if (person.forceSecondName && person.secondName) {
    const split = person.secondName.split(' ');
    if (split.length == 1) {
      name += split[0];
    } else {
      name += split.map((s) => s[0] + '.').join('');
    }
    name += ' '
  }
  if (person.nickname) {
    name += ` "${person.nickname}"`;
  }
  return name + person.lastName;
};

const regex = /https:\/\/([a-z]{2})\.wikipedia\.org\/wiki\/(.*)/;

export const generateWikiImageUrl = (url?: string): string | undefined => {
  if (url && regex.test(url)) {
    return url.replace(
      regex,
      'https://$1.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&origin=*&titles=$2'
    );
  }
};
