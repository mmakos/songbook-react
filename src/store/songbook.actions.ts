import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpService } from '../http/http.service.ts';
import { ISongOverview, ISong, ISongOverview } from '../types/song.types.ts';
import { setAutocompleteLoad } from './songbook.reducer.ts';

export const fetchSongList = createAsyncThunk('songbook/fetchSongList', async () => {
  return await HttpService.get('songs/').then((response) => {
    return response.data as ISongOverview[];
  });
});

export const getSong = createAsyncThunk('songbook/getSong', async (id: string) => {
  return await HttpService.get(`song/${id}/`).then((response) => {
    return response.data as ISong;
  });
});

export const getAutocomplete = createAsyncThunk('songbook/autocomplete', async (key: string, thunkAPI) => {
  thunkAPI.dispatch(setAutocompleteLoad());
  return await HttpService.get(`autocomplete/?q=${key}`).then((response) => {
    return response.data as ISongOverview[];
  });
});
