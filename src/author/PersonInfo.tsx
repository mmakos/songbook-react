import { FC } from 'react';
import { Divider, Link, Paper, Stack, useTheme } from '@mui/material';
import { IPerson } from '../types/song.types.ts';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import { personAsString } from './author.utils.ts';
import PersonNames from './PersonNames.tsx';
import EditorInfo from '../song/EditorInfo.tsx';
import WaitingEditsInfo from "../song/WaitingEditsInfo.tsx";

interface IPersonInfoProps {
  personSlug: string;
  person: IPerson;
  imageUrl?: string;
}

const PersonInfo: FC<IPersonInfoProps> = ({ personSlug, person, imageUrl }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em' }}>
      <Stack direction="row" flexWrap="wrap" spacing={1} justifyContent="space-between" useFlexGap>
        <Stack spacing={1} justifyContent="space-between">
          <PersonNames person={person} />
          {person.url && (
            <Stack direction="row" spacing={1}>
              <InfoUrlIcon url={person.url} />
              <Link href={person.url} color="inherit" underline="hover" target="_blank" rel="noopener">
                Więcej informacje o osobie
              </Link>
            </Stack>
          )}
        </Stack>
        {imageUrl && (
          <a href={imageUrl} target="_blank" rel="noopener">
            <img
              src={imageUrl}
              style={{
                height: '240px',
                borderRadius: theme.shape.borderRadius,
                border: 'solid',
                borderColor: theme.palette.divider,
              }}
              alt={personAsString(person)}
            />
          </a>
        )}
      </Stack>
      <Divider sx={{ my: '0.5em' }} />
      <EditorInfo prefix="Dodano" editorInfo={person.created} />
      {person.edited && <EditorInfo prefix="Edytowano" editorInfo={person.edited} />}
      <WaitingEditsInfo waiting={person} routeTo={`/person/${personSlug}`} />
    </Paper>
  );
};

export default PersonInfo;
