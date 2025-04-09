import { IAuthorEdit, ISource, ISourceData, SourceType } from '../../types/song.types.ts';

export const sourceToSourceData = (source: ISource): ISourceData => ({
  name: source.name,
  url: source.url,
  year: source.year,
  type: source.type,
});

export const splitToNewAndExistingSource = (
  sources: (ISource | string)[],
  current?: IAuthorEdit<ISourceData>
): IAuthorEdit<ISourceData> | undefined => {
  const news: ISourceData[] = [];
  const existing: string[] = [];
  for (const source of sources) {
    if (typeof source === 'string') {
      const currentNew = current?.new?.find((s) => s.name === source);
      news.push(
        currentNew ?? {
          name: source,
          type: SourceType.MUSICAL,
        }
      );
    } else {
      existing.push(source.slug);
    }
  }
  const result: IAuthorEdit<ISourceData> = {};
  if (news.length) result.new = news;
  if (existing.length) result.existing = existing;

  if (Object.keys(result).length) return result;
};

export const getSourceFromSongEdit = (
  sourceEdit?: IAuthorEdit<ISourceData>,
  songSource?: ISource[]
): (ISource | string)[] => {
  const result: (ISource | string)[] = [];
  sourceEdit?.existing?.forEach((e) => {
    const found = songSource?.find((s) => s.slug === e);
    found && result.push(found);
  });
  sourceEdit?.new?.forEach((n) => result.push(n.name));
  return result;
};
