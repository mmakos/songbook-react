import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Container, Typography } from '@mui/material';
import PersonInfo from './PersonInfo.tsx';
import { personAsString } from './author.utils.ts';
import Progress from '../components/Progress.tsx';
import { IPerson } from '../types/song.types.ts';
import { fetchAuthor } from './author.actions.ts';
import { Edit, Verified } from '@mui/icons-material';
import useCanEdit from '../store/useCanEdit.hook.ts';
import RouteIconButton from '../components/RouteIconButton.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';
import SongList from '../song-list/SongList.tsx';

const Person = () => {
  const [person, setPerson] = useState<IPerson>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { personSlug, username } = useParams();
  const { canEdit, canVerify } = useCanEdit();

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
          <BasicTooltip title="Edytuj osobę" style={{ marginLeft: 'auto' }}>
            <RouteIconButton to={`/edit/person/${slugAndUser}`}>
              <Edit />
            </RouteIconButton>
          </BasicTooltip>
        )}
        {canVerify && (person.waiting || !person.created.verified) && (
          <BasicTooltip title="Zweryfikuj oczekujące edycje">
            <RouteIconButton to={`/verify/person/${personSlug}`}>
              <Verified />
            </RouteIconButton>
          </BasicTooltip>
        )}
      </Typography>
      <PersonInfo personSlug={personSlug} person={person} imageUrl={imageUrl} />
      <SongList person={personSlug} />
    </Container>
  );
};

export default Person;
