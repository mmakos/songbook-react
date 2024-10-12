import { SourceType } from '../types/song.types.ts';

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
