import { IBand, IPerson, ISongOverview, ISource } from '../types/song.types.ts';

export interface IFastSearch {
  songs: ISongOverview[];
  people: IPerson[];
  bands: IBand[];
  sources: ISource[];
}
