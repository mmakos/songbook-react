import { IPerson, SourceType } from '../types/song.types.ts';

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
    name += ' ';
  }
  if (person.nickname) {
    name += `"${person.nickname}" `;
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

export const sourceTypeGenitive = (type: SourceType) => {
  switch (type) {
    case SourceType.GAME:
      return 'z gry';
    case SourceType.MOVIE:
      return 'z filmu';
    case SourceType.MUSICAL:
      return 'z musicalu';
    case SourceType.PLAY:
      return 'ze słuchowiska';
    case SourceType.SOUNDTRACK:
      return 'ze ścieżki dźwiękowej';
  }
};

export const sourceTypeAblative = (type: SourceType) => {
  switch (type) {
    case SourceType.GAME:
      return 'grze';
    case SourceType.MOVIE:
      return 'filmie';
    case SourceType.MUSICAL:
      return 'musicalu';
    case SourceType.PLAY:
      return 'słuchowisku';
    case SourceType.SOUNDTRACK:
      return 'ścieżce dźwiękowej';
  }
};

export const sourceTypeNominative = (type: SourceType) => {
  switch (type) {
    case SourceType.GAME:
      return 'Gra';
    case SourceType.MOVIE:
      return 'Film';
    case SourceType.MUSICAL:
      return 'Musical';
    case SourceType.PLAY:
      return 'Słuchowisko';
    case SourceType.SOUNDTRACK:
      return 'Ścieżka dźwiękowa';
  }
};
