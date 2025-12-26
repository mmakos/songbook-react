import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useParams } from 'react-router';
import { getAndSaveSong } from '../store/songbook.actions.ts';
import { clearSong } from '../store/songbook.reducer.ts';
import NotFound from '../subsites/NotFound.tsx';
import Song from './Song.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';
import { CurrentMeetingContextProvider } from '../meeting/CurrentMeetingContext.tsx';

const GlobalSong: FC = () => {
  const song = useAppSelector((state) => state.song);
  const songTimeout = useAppSelector((state) => state.songTimeout);
  const dispatch = useAppDispatch();
  const { songSlug, username } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(clearSong());
    songSlug && dispatch(getAndSaveSong({ slug: songSlug, username }));
  }, [songSlug, username]);

  useEffect(() => {
    return () => {
      dispatch(clearSong());
    };
  }, []);

  if (songTimeout) {
    return <NotFound />;
  }

  return (
    <>
      <BasicHelmet
        title={song?.title}
        href={`/song/${songSlug}`}
        description={song && `${song.title} - tekst piosenki, akordy, chwyty`}
      />
      <CurrentMeetingContextProvider>
        <Song song={song} />
      </CurrentMeetingContextProvider>
    </>
  );
};

export default GlobalSong;
