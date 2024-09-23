import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import RouteLink from '../components/RouteLink.tsx';
import { useEffect } from 'react';
import { fetchSongList } from '../store/songbook.actions.ts';

const SongList = () => {
  const songs = useAppSelector((state) => state.songs);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!songs) {
      dispatch(fetchSongList());
    }
  }, []);

  if (!songs) return;

  return (
    <div>
      {songs.map((song) => (
        <div key={song.id}>
          <RouteLink to={`/songs/${song.id}`}>{song.title}</RouteLink>
        </div>
      ))}
    </div>
  );
};

export default SongList;
