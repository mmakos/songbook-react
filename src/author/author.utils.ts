import { IPersonData, SourceType } from '../types/song.types.ts';

export const personAsString = (person: IPersonData): string => {
  let name;
  if (person.nickname && (person.forceNickname || person.nickname.includes(' '))) {
    name = person.nickname;
  } else {
    name = person.name + ' ';
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
    name += person.lastName;
  }
  if (person.title) {
    const title = personTitles[person.title];
    if (title?.length) {
      name = `${title[0]} ${name}`;
      if (title.length > 2) {
        name += ' ' + title[2];
      }
    }
  }
  return name;
};

export const parsePersonName = (name: string): IPersonData => {
  const split = name.trim().split(/\s+/);
  if (split.length < 2) {
    return {
      name: '',
      lastName: '',
      nickname: name,
      forceNickname: true,
    };
  } else if (split.length === 2) {
    return {
      name: split[0],
      lastName: split[1],
    };
  } else {
    return {
      name: split[0],
      secondName: split
        .slice(1, split.length - 1)
        .filter((s) => !s.startsWith('"') || !s.endsWith('"'))
        .join(' '),
      lastName: split[split.length - 1],
      nickname: split
        .slice(1, split.length - 1)
        .find((s) => s.startsWith('"') && !s.endsWith('"'))
        ?.replace('"', ''),
    };
  }
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

export const personTitles: Record<string, [string, string, string?]> = {
  captain: ['kpt.', 'Kapitan'],
  colonel: ['płk.', 'Pułkownik'],
  ['lieutenant-colonel']: ['ppłk.', 'Podpułkownik'],
  major: ['kpt.', 'Kapitan'],
  op: ['o.', 'Ojciec Dominikanin', 'OP'],
  sj: ['o.', 'Ojciec Jezuita', 'SJ'],
  priest: ['ks.', 'Ksiądz'],
  saint: ['św.', 'Święty'],
  sister: ['s.', 'Siostra'],
};
