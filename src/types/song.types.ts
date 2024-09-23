export type TCategory = 'kaczmarski' | 'common' | 'patriotic' | 'religious' | 'carols' | string;

export interface ISongOverview {
  id: string;
  title: string;
}

export interface ICategorizedSongOverview extends ISongOverview {
  category: ICategory;
}

export interface ISong {
  id: number;
  title: string;
  category: ICategory;
  created: IEditorInfo;
  edited?: IEditorInfo;
  lyrics?: IAuthor[];
  composer?: IAuthor[];
  translation?: IAuthor[];
  performers?: IAuthor[];
  performances?: IPerformance[];

  key: ISongKey;
  verses: IVerse[];

  next?: ISongOverview;
  previous?: ISongOverview;
}

export interface IAuthor {
  id: string;
  name: string;
  lastName?: string;
}

export interface IPerformance {
  url: string;
}

export interface ICategory {
  id: TCategory;
  name: string;
}

export interface IEditorInfo {
  name: string;
  userVerified?: boolean;
  verified?: boolean;
  time: number;
}

/**
 * Zwrotka
 */
export interface IVerse {
  /**
   * Wersy
   */
  lines: ILine[];
  /**
   * Wcięcie zwrotki
   */
  indent: number;
  /**
   * Indeks właściwej zwrotki (w przypadku skrócenia ...)
   */
  verseRef?: number;
}

/**
 * Pojedynczy wers
 */
export interface ILine {
  /**
   * Tekst (jeśli nie ma to wers instrumentalny)
   */
  text?: ITextRun[];
  /**
   * Czy wers jest powtarzany
   */
  repetition?: boolean;
  /**
   * Jeśli jest to ostatni z serii powtarzanych wersów, to liczba powtórzeń. Wartość ujemna oznacza nieskończoność
   */
  repetitionEnd?: number;
  /**
   * Akordy
   */
  chords?: IChords;
  /**
   * Komentarze wykonawcze
   */
  comment?: string;
  /**
   * Ewentualna zmiana tonacji
   */
  transposition?: IKey;
}

/**
 * Najmniejsza część opisująca fragment tekstowy (tak jak w docx)
 */
export interface ITextRun {
  text: string;
  italic?: boolean;
  underline?: boolean;
  bold?: boolean;
}

/**
 * Zestaw akordów dla wersu
 */
export interface IChords {
  /**
   * Akordy podstawowe
   */
  chords: IChordSeries[];
  /**
   * Alternatywa dla linii (oddzielona |)
   */
  alternatives?: IChordSeries[];
}

/**
 * Ciąg kilku akordów (mogą być np. opcjonalne (w nawiasach) lub ciche (k
 */
export interface IChordSeries {
  chords: IComplexChord[];
  /**
   * Opcjonalne akordy lub grane jako przejście
   */
  optional?: boolean;
  /**
   * Harmonia, ale a'capella
   */
  silent?: boolean;
  /**
   * Powtarzanie serii akordów (... po serii)
   */
  repeat?: boolean;
}

/**
 * Reprezentacja jednego akordu (np. akord + alternatywa)
 */
export interface IComplexChord {
  /**
   * Podstawowy akord
   */
  chord: IChord;
  /**
   * Alternatywny akord (po ukośniku, np. A/cis)
   */
  alternative?: IChord;
}

/**
 * Pojedynczy akord
 */
export interface IChord {
  /**
   * Pryma akordu
   */
  note: INote;
  /**
   * Tryb akordu (dur/moll)
   */
  minor?: boolean;
  /**
   * Modyfikacja (zwiększony/zmniejszony)
   */
  modification?: ChordModification;
  /**
   * Składnik w basie (domyślnie pryma)
   */
  base?: IAdditionalSeries;
  /**
   * Dodatkowe składniki (np. septyma; nona) wraz z opóźnieniami
   */
  additionals?: IAdditionalSeries[];
  /**
   * Akord bez prymy (przekreślona 1 w basie)
   */
  noPrime?: boolean;
}

/**
 * Tonacja piosenki
 */
export interface ISongKey {
  /**
   * Tonacja w śpiewniku (taka jaką widać)
   */
  songbook: IKey;
  /**
   * Oryginalna tonacja
   */
  original?: IKey;
  /**
   * Tonacja komfortowa do śpiewania (lub zakres tonacji)
   */
  comfort?: IKey[];
}

/**
 * Tonacja
 */
export interface IKey {
  note: INote;
  minor?: boolean;
}

/**
 * Pojedyncza nuta/dźwięk
 */
export interface INote {
  /**
   * Podstawowy dźwięk (biały klawisz, np. c, d, e)
   */
  base: NoteBase;
  /**
   * Znak (brak, krzyżyk, bemol)
   */
  accidental?: Accidental;
}

/**
 * Ciąg dodatkowych składników (np. 7-6-5, czyli opóźnienia).
 */
export interface IAdditionalSeries {
  elements: IElement[];
}

/**
 * Składnik akordu (np. tercja, septyma wielka)
 */
export interface IElement {
  /**
   * Podstawowy składnik (np. tercja, septyma)
   */
  interval: number;
  /**
   * Modyfikacja składnika (wielka/zwiększona, mała/zmniejszona)
   */
  modification?: IntervalModification;
  /**
   * Opcjonalny element (w nawiasach)
   */
  optional?: boolean;
}

export enum NoteBase {
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  A = 'A',
  H = 'H',
}

export enum ChordModification {
  AUG = 'AUG',
  DIM = 'DIM',
  CLUSTER = 'CLUSTER',
}

export enum IntervalModification {
  AUG = 'AUG',
  DIM = 'DIM',
}

export enum Accidental {
  FLAT = 'FLAT',
  SHARP = 'SHARP',
}
