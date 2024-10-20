import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpService } from '../http/http.service.ts';
import { ISong, ISongOverview } from '../types/song.types.ts';

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
