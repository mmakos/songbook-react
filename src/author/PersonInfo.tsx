import { FC } from 'react';
import { Divider, Link, Paper, useTheme } from '@mui/material';
import { IPerson } from '../types/song.types.ts';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import { personAsString } from './author.utils.ts';
import PersonNames from './PersonNames.tsx';

interface IPersonInfoProps {
  person: IPerson;
  imageUrl?: string;
}

const PersonInfo: FC<IPersonInfoProps> = ({ person, imageUrl }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: "wrap", gap: "1em" }}>
        <PersonNames person={person} />
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
      </div>
      {person.url && (
        <>
          <Divider sx={{ my: '0.5em' }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InfoUrlIcon url={person.url} sx={{ mr: '0.3em' }} />
            <Link href={person.url} color="inherit" underline="hover" target="_blank" rel="noopener">
              Więcej informacje o osobie
            </Link>
          </div>
        </>
      )}
    </Paper>
  );
};

export default PersonInfo;
