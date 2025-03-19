import { IKey } from '../types/song.types.ts';

export const PIANO_KEYS = 27;
export const PIANO_WHITE_KEYS = 16;

export type TInversion = 0 | 1 | 2;

export interface IPianoKey {
  note: number;
  black?: boolean;
  selected?: boolean;
}

export interface IPianoToggleOptions {
  touch?: boolean; // Czy klawisz trzeba trzymać
  chord?: boolean;
  minor?: boolean;
  sixth?: boolean;
  seventh?: boolean;
  inversion: TInversion;
}

export interface IPianoOptions {
  maxKeys: number; // Maksymalna liczba wciśniętych klawiszy jednocześnie
  soundLength: number;
  clear: void;
  insert: void;
  tune: IKey;
}

export const defaultPianoToggleOptions: IPianoToggleOptions = {
  touch: true,
  chord: true,
  inversion: 0,
};
