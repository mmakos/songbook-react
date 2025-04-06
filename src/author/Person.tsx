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
  const { personSlug, username } = useParams();
  const { canEdit } = useCanEdit();

  const slugAndUser = `${personSlug}${username ? '/' + username : ''}`;

  const fetchPerson = () => {
    if (!personSlug) return;
    fetchAuthor<IPerson>(`person/${slugAndUser}/`, (person) => setPerson(person), setImageUrl);
  };

  useEffect(() => {
    setPerson(undefined);
    fetchPerson();
  }, [personSlug]);

  useEffect(() => {
    fetchPerson();
  }, [username]);

  if (!person || !personSlug) return <Progress />;

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
          <RouteIconButton to={`/edit/person/${slugAndUser}`} sx={{ ml: 'auto' }}>
            <Edit />
          </RouteIconButton>
        )}
      </Typography>
      <PersonInfo personSlug={personSlug} person={person} imageUrl={imageUrl} />
      <Paper>
        <SongTable person={personSlug} />
      </Paper>
    </Container>
  );
};

export default Person;
