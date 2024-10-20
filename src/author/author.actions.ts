// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { generateWikiImageUrl } from './author.utils.ts';
import { HttpService } from '../http/http.service.ts';
import { IBand, IPerson, ISource } from '../types/song.types.ts';

const fetchAuthorImageUrl = (setAuthorImageUrl: (url: string) => void, authorUrl?: string) => {
  if (!authorUrl) return;
  const imageApiUrl = generateWikiImageUrl(authorUrl);
  if (imageApiUrl) {
    HttpService.getExternal(imageApiUrl).then((response) => {
      const pages = response.data?.query?.pages;
      if (pages) {
        setAuthorImageUrl(Object.values(pages)[0]?.original?.source);
      }
    });
  }
};

export const fetchAuthor = (
  href: string,
  setAuthor: (author: IBand | ISource | IPerson) => void,
  setAuthorImageUrl: (url: string) => void
) => {
  HttpService.get(href).then((response) => {
    const author = response.data;
    setAuthor(author);
    fetchAuthorImageUrl(setAuthorImageUrl, author.url);
  });
};
