import { IAuthorEdit, IBandData, IBandOverview } from '../../types/song.types.ts';

export const bandToBandData = (band: IBandData): IBandData => ({
  name: band.name,
  url: band.url,
});

export const splitToNewAndExistingBand = (
  band: IBandOverview | string | null,
  current?: IAuthorEdit<IBandData, true>
): IAuthorEdit<IBandData, true> | undefined => {
  if (band === null) return;
  if (typeof band === 'string') {
    if (current?.new?.name === band) return { new: current.new };
    return { new: { name: band } };
  }
  return { existing: band.slug };
};

export const getBandFromSongEdit = (
  bandEdit?: IAuthorEdit<IBandData, true>,
  songBand?: IBandOverview
): IBandOverview | string | null => {
  if (bandEdit?.existing && bandEdit.existing === songBand?.slug) return songBand;
  if (bandEdit?.new) return bandEdit.new.name;
  return null;
};
