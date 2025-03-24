import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Container, Paper, Typography } from '@mui/material';
import PersonInfo from './PersonInfo.tsx';
import { personAsString } from './author.utils.ts';
import Progress from '../components/Progress.tsx';
import SongTable from '../song-list/SongTable.tsx';
import { IPerson } from '../types/song.types.ts';
import { fetchAuthor } from './author.actions.ts';

const Person = () => {
  const [person, setPerson] = useState<IPerson>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { personSlug } = useParams();

  const fetchPerson = () => {
    if (!personSlug) return;
    fetchAuthor(`person/${personSlug}/`, (person) => setPerson(person as IPerson), setImageUrl);
  };

  useEffect(() => {
    setPerson(undefined);
    fetchPerson();
  }, [personSlug]);

  if (!person) return <Progress />;

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" mb="0.5rem">
        {personAsString(person)}
      </Typography>
      <PersonInfo person={person} imageUrl={imageUrl} />
      <Paper>
        <SongTable person={personSlug} />
      </Paper>
    </Container>
  );
};

export default Person;
