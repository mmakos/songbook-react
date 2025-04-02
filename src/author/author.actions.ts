// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { generateWikiImageUrl } from './author.utils.ts';
import { api } from '../http/api.ts';
import { IBand, IPerson, ISource } from '../types/song.types.ts';
import axios from "axios";

const fetchAuthorImageUrl = (setAuthorImageUrl: (url: string) => void, authorUrl?: string) => {
  if (!authorUrl) return;
  const imageApiUrl = generateWikiImageUrl(authorUrl);
  if (imageApiUrl) {
    axios.get(imageApiUrl).then((response) => {
      const pages = response.data?.query?.pages;
      if (pages) {
        setAuthorImageUrl(Object.values(pages)[0]?.original?.source);
      }
    });
  }
};

export const fetchAuthor = <T extends IBand | ISource | IPerson>(
  href: string,
  setAuthor: (author: T) => void,
  setAuthorImageUrl?: (url: string) => void
) => {
  api.get(href).then((response) => {
    const author = response.data;
    setAuthor(author);
    setAuthorImageUrl && fetchAuthorImageUrl(setAuthorImageUrl, author.url);
  });
};
