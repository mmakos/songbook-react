import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Container, Paper, Typography } from '@mui/material';
import PersonInfo from './PersonInfo.tsx';
import { personAsString } from './author.utils.ts';
import Progress from '../components/Progress.tsx';
import SongTable from '../song-list/SongTable.tsx';
import { IPerson } from '../types/song.types.ts';
import { fetchAuthor } from './author.actions.ts';
import { Edit } from '@mui/icons-material';
import useCanEdit from '../store/useCanEdit.hook.ts';
import RouteIconButton from '../components/RouteIconButton.tsx';

const Person = () => {
  const [person, setPerson] = useState<IPerson>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { personSlug } = useParams();
  const { canEdit } = useCanEdit();

  const fetchPerson = () => {
    if (!personSlug) return;
    fetchAuthor<IPerson>(`person/${personSlug}/`, (person) => setPerson(person), setImageUrl);
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
      <Typography variant="h4" mb="0.5rem" display="flex">
        {personAsString(person)}
        {canEdit && (
          <RouteIconButton to={`/edit/person/${personSlug}`} sx={{ ml: 'auto' }}>
            <Edit />
          </RouteIconButton>
        )}
      </Typography>
      <PersonInfo person={person} imageUrl={imageUrl} />
      <Paper>
        <SongTable person={personSlug} />
      </Paper>
    </Container>
  );
};

export default Person;
