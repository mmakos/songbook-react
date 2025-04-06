import { IBandOverview, IPersonOverview, ISongOverview, ISourceOverview } from '../types/song.types.ts';

export interface IFastSearch {
  songs: ISongOverview[];
  people: IPersonOverview[];
  bands: IBandOverview[];
  sources: ISourceOverview[];
}
