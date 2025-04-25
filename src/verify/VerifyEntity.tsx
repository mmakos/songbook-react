import { useNavigate, useParams } from 'react-router';
import { ComponentType, useEffect, useState } from 'react';
import { IBand, IPerson, ISource } from '../types/song.types.ts';
import useAuthAPI from '../http/useAuthAPI.ts';
import { AxiosResponse } from 'axios';
import { useAppDispatch } from '../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../store/songbook.reducer.ts';
import Grid from '@mui/material/Grid2';
import Progress from '../components/Progress.tsx';
import { Button, Stack, Typography } from '@mui/material';
import EditorInfo from '../song/EditorInfo.tsx';
import { ThumbDown, ThumbUp } from '@mui/icons-material';
import RouteButton from '../components/RouteButton.tsx';

interface IVerifyEntityProps<Entity extends IBand | ISource | IPerson> {
  entityId: string;
  Editor: ComponentType<{ title: string; entity: Entity; setEntity: (e: Entity) => void }>;
}

const VerifyEntity = <Entity extends IBand | ISource | IPerson>({ entityId, Editor }: IVerifyEntityProps<Entity>) => {
  const { slug } = useParams();
  const [entity, setEntity] = useState<Entity>();
  const [edits, setEdits] = useState<Record<string, Entity>>({});
  const { authAPI, accessToken } = useAuthAPI();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchEntities = () => {
    if (!slug || !accessToken) return;
    authAPI
      .get(`verify/${entityId}/${slug}/`)
      .then((response: AxiosResponse<Entity[]>) => {
        const entities = response.data;
        if (!entities.length || (entities.length === 1 && entities[0].created.verified)) {
          dispatch(notifyError('Nie ma nic do zweryfikowania'));
          navigate(`/${entityId}/${slug}`);
        } else {
          setEntity(entities.splice(0, 1)[0]);
          const edits: Record<string, Entity> = {};
          for (const edit of entities) {
            if (edit.edited?.name) edits[edit.edited.name] = edit;
          }
          setEdits(edits);
        }
      })
      .catch(() => {
        dispatch(notifyError('Błąd podczas pobierania danych do weryfikacji'));
        navigate(`/${entityId}/${slug}`);
      });
  };

  useEffect(() => {
    fetchEntities();
  }, [slug, accessToken]);

  if (!entity) return <Progress />;

  const sortedEdits = Object.entries(edits);
  if (!sortedEdits.length && entity.created.verified)
    return (
      <Stack spacing={2}>
        <Typography>Nie ma więcej edycji do weryfikacji</Typography>
        <RouteButton to={`/${entityId}/${slug}`}>Wróć do strony osoby/zespołu/źródła</RouteButton>
      </Stack>
    );

  sortedEdits.sort(([, e1], [, e2]) => e2.edited!.time - e1.edited!.time);

  const handleSetEdit = (user: string, edit: Entity) => {
    edits[user] = edit;
    setEdits({ ...edits });
  };

  const handleDeleteEdit = (user: string) => {
    authAPI
      .delete(`verify/${entityId}/${slug}/${user}/`)
      .then(() => {
        delete edits[user];
        setEdits({ ...edits });
        dispatch(notifySuccess(`Odrzucono edycję użytkownika ${user}`));
      })
      .catch(() => dispatch(notifyError(`Błąd podczas odrzucania edycji użytkownika ${user}`)));
  };

  const handleAcceptEdit = (user: string) => {
    const edit = edits[user];
    authAPI
      .post(`verify/${entityId}/${slug}/${user}/`, edit)
      .then(() => {
        delete edits[user];
        setEntity(edit);
        setEdits({ ...edits });
        dispatch(notifySuccess(`Zaakceptowano edycję użytkownika ${user}`));
      })
      .catch(() => dispatch(notifyError(`Błąd podczas akceptowania edycji użytkownika ${user}`)));
  };

  const handleAcceptCreated = () => {
    if (!entity) return;
    authAPI
      .post(`verify/${entityId}/${slug}/`, entity)
      .then(() => {
        entity.created.verified = true;
        setEntity({ ...entity });
        dispatch(notifySuccess(`Zaakceptowano nową osobę/zespół/źródło`));
      })
      .catch(() => dispatch(notifyError('Błąd podczas akceptowania nowej osoby/zespółu/źródła')));
  };

  return (
    <Stack spacing={2} width="100%">
      <Grid container columnSpacing={4} rowSpacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack spacing={2}>
            <Editor
              title={
                entity.created.verified
                  ? 'Obecna wersja'
                  : `Utworzono przez ${entity.created.name ?? 'nieznanego użytkownika'}`
              }
              entity={entity}
              setEntity={entity.created.verified ? setEntity : () => {}}
            />
            <Stack>
              <EditorInfo prefix="Utworzono" editorInfo={entity.created} />
              {entity.edited && <EditorInfo prefix="Edytowano" editorInfo={entity.edited} />}
            </Stack>
            {!entity.created.verified && (
              <Button variant="contained" endIcon={<ThumbUp />} onClick={handleAcceptCreated} fullWidth>
                Akceptuj
              </Button>
            )}
          </Stack>
        </Grid>
        {Object.entries(edits).map(([user, entity]) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${entityId}-${user}`}>
            <Stack spacing={2}>
              <Editor title={`Edytowano przez ${user}`} entity={entity} setEntity={(e) => handleSetEdit(user, e)} />
              <EditorInfo prefix="Edytowano" editorInfo={entity.edited!} />
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<ThumbDown />} onClick={() => handleDeleteEdit(user)} fullWidth>
                  Odrzuć
                </Button>
                <Button variant="contained" endIcon={<ThumbUp />} onClick={() => handleAcceptEdit(user)} fullWidth>
                  Akceptuj
                </Button>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>
      <RouteButton to={`/${entityId}/${slug}`}>Zakończ</RouteButton>
    </Stack>
  );
};

export default VerifyEntity;
