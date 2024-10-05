import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useEffect, useMemo } from 'react';
import { fetchSongList } from '../store/songbook.actions.ts';
import FullscreenPaper from '../components/FullscreenPaper.tsx';
import { useParams } from 'react-router-dom';
import SongListGrid from './SongListGrid.tsx';

const SongList = () => {
  const songs = useAppSelector((state) => state.songs);
  const { category } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!songs) {
      dispatch(fetchSongList());
    }
  }, []);

  const categorySongs = useMemo(() => {
    if (!songs) return undefined;
    const filteredSongs = category ? songs.filter((song) => song.category === category) : [...songs];
    filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
    return filteredSongs;
  }, [songs, category]);

  if (!categorySongs) return;

  return (
    <FullscreenPaper>
      <SongListGrid songs={categorySongs} />
    </FullscreenPaper>
  );
};

export default SongList;
