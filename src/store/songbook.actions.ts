import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpService } from '../http/http.service.ts';
import { ISong } from '../types/song.types.ts';
import pako from 'pako';
import {resetSongTimeout} from "./songbook.reducer.ts";

const decompress = (compressedBase64: string) => {
  const compressedData = Uint8Array.from(atob(compressedBase64), (c) => c.charCodeAt(0));

  return pako.inflate(compressedData, { to: 'string' });
};

export const getSong = createAsyncThunk('songbook/getSong', async (slug: string, thunkAPI) => {
  thunkAPI.dispatch(resetSongTimeout());
  return await HttpService.get(`song/${slug}/`).then((response) => {
    const song: ISong = response.data;
    song.verses = JSON.parse(decompress(response.data.verses));
    return song;
  }).catch(() => thunkAPI.rejectWithValue(undefined));
});
