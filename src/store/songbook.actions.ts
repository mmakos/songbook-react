import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpService } from '../http/http.service.ts';
import { ISong, ISongOverview } from '../types/song.types.ts';
import { IBandState, IPersonState, ISourceState, setAutocompleteLoad } from './songbook.reducer.ts';
import { generateWikiImageUrl } from '../author/person.utils.ts';

export const fetchSongList = createAsyncThunk('songbook/fetchSongList', async () => {
  return await HttpService.get('songs/').then((response) => {
    return response.data as ISongOverview[];
  });
});

export const getSong = createAsyncThunk('songbook/getSong', async (slug: string) => {
  return await HttpService.get(`song/${slug}/`).then((response) => {
    return response.data as ISong;
  });
});

export const getAutocomplete = createAsyncThunk('songbook/autocomplete', async (key: string, thunkAPI) => {
  thunkAPI.dispatch(setAutocompleteLoad());
  return await HttpService.get(`autocomplete/?q=${key}`).then((response) => {
    return response.data as ISongOverview[];
  });
});

export const getPerson = createAsyncThunk('songbook/person', async (slug: string, thunkAPI) => {
  return await HttpService.get(`person/${slug}/`).then((response) => {
    const personState = response.data as IPersonState;
    const imageApiUrl = generateWikiImageUrl(personState.person?.url);
    if (imageApiUrl) {
      thunkAPI.dispatch(getPersonImageUrl(imageApiUrl));
    }
    return personState;
  });
});

export const getPersonImageUrl = createAsyncThunk('songbook/personImageUrl', async (imageUrl: string) => {
  return await HttpService.getExternal(imageUrl).then((response) => {
    const pages = response.data?.query?.pages;
    if (pages) {
      return Object.values(pages)[0]?.original?.source;
    }
  });
});

export const getBand = createAsyncThunk('songbook/band', async (slug: string, thunkAPI) => {
  return await HttpService.get(`band/${slug}/`).then((response) => {
    const bandState = response.data as IBandState;
    const imageApiUrl = generateWikiImageUrl(bandState.band?.url);
    if (imageApiUrl) {
      thunkAPI.dispatch(getBandImageUrl(imageApiUrl));
    }
    return bandState;
  });
});

export const getBandImageUrl = createAsyncThunk('songbook/bandImageUrl', async (imageUrl: string) => {
  return await HttpService.getExternal(imageUrl).then((response) => {
    const pages = response.data?.query?.pages;
    if (pages) {
      return Object.values(pages)[0]?.original?.source;
    }
  });
});

export const getSource = createAsyncThunk('songbook/source', async (slug: string, thunkAPI) => {
  return await HttpService.get(`source/${slug}/`).then((response) => {
    const sourceState = response.data as ISourceState;
    const imageApiUrl = generateWikiImageUrl(sourceState.source?.url);
    if (imageApiUrl) {
      thunkAPI.dispatch(getSourceImageUrl(imageApiUrl));
    }
    return sourceState;
  });
});

export const getSourceImageUrl = createAsyncThunk('songbook/sourceImageUrl', async (imageUrl: string) => {
  return await HttpService.getExternal(imageUrl).then((response) => {
    const pages = response.data?.query?.pages;
    if (pages) {
      return Object.values(pages)[0]?.original?.source;
    }
  });
});
