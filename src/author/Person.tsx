import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useEffect, useMemo } from 'react';
import { getPerson } from '../store/songbook.actions.ts';
import { useParams } from 'react-router-dom';
import { clearPerson } from '../store/songbook.reducer.ts';
import { Divider, Paper, Typography } from '@mui/material';
import RouteLink from '../components/RouteLink.tsx';
import PersonInfo from './PersonInfo.tsx';
import { personAsString } from './person.utils.ts';
import Progress from '../components/Progress.tsx';

const Person = () => {
  const dispatch = useAppDispatch();
  const person = useAppSelector((state) => state.person);
  const { personSlug } = useParams();

  useEffect(() => {
    personSlug && dispatch(getPerson(personSlug));
  }, [personSlug]);

  useEffect(() => {
    return () => {
      dispatch(clearPerson());
    };
  }, []);

  const songs = useMemo(() => {
    if (!person.songs) return;
    const s = [...person.songs];
    s.sort((a, b) => a.title.localeCompare(b.title));
    return s;
  }, [person.songs]);

  if (!person.person) return <Progress />;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5em',
        marginTop: '1em',
        minWidth: '50%',
      }}
    >
      <div style={{ flex: 1 }}>
        <Typography variant="h4" mb="0.5rem">
          {personAsString(person.person)}
        </Typography>
        <PersonInfo person={person.person} imageUrl={person.imageUrl} />
        {songs && (
          <Paper sx={{ display: 'flex', flexDirection: 'column', padding: '0.5em 1em' }}>
            <Typography variant="h5">Piosenki</Typography>
            <Divider sx={{ my: '0.5em' }} />
            {songs.map((song) => (
              <RouteLink key={song.slug} lineHeight={1.75} color={'textPrimary'} to={`/song/${song.slug}`}>
                {song.title}
              </RouteLink>
            ))}
          </Paper>
        )}
      </div>
    </div>
  );
};

export default Person;
