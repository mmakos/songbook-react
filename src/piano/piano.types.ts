import { IKey } from '../types/song.types.ts';

export const PIANO_KEYS = 27;
export const PIANO_WHITE_KEYS = 16;

export type TInversion = 0 | 1 | 2;

export enum ChordMode {
  KEY,
  MAJOR,
  MINOR,
}

export interface IPianoKey {
  note: number;
  black?: boolean;
  selected?: boolean;
}

export interface IPianoToggleOptions {
  touch?: boolean; // Czy klawisz trzeba trzymać
  chord?: boolean;
  sixth?: boolean;
  seventh?: boolean;
  mode: ChordMode;
  inversion: TInversion;
}

export interface IPianoOptions {
  maxKeys: number; // Maksymalna liczba wciśniętych klawiszy jednocześnie
  soundLength: number;
  clear: void;
  insert: void;
  tune: IKey;
}

export const defaultPianoOptions: IPianoToggleOptions = {
  touch: true,
  chord: true,
  mode: ChordMode.KEY,
  inversion: 0,
};
