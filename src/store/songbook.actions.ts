import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../http/api.ts';
import { ISong } from '../types/song.types.ts';
import pako from 'pako';
import { resetSongTimeout } from './songbook.reducer.ts';

export const decompress = (compressedBase64: string) => {
  const compressedData = Uint8Array.from(atob(compressedBase64), (c) => c.charCodeAt(0));

  return pako.inflate(compressedData, { to: 'string' });
};

const createFetchSongAsyncThunk = (name: string) =>
  createAsyncThunk(name, async (slug: string, thunkAPI) => {
    thunkAPI.dispatch(resetSongTimeout());
    return await api.get(`song/${slug}/`)
      .then((response) => {
        const song: ISong = response.data;
        song.verses = JSON.parse(decompress(response.data.verses));
        return song;
      })
      .catch(() => thunkAPI.rejectWithValue(undefined));
  });

export const getSong = createFetchSongAsyncThunk('songbook/getSong');
export const getAndSaveSong = createFetchSongAsyncThunk('songbook/getAndSaveSong');
