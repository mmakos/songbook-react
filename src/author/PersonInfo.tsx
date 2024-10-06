import React, { FC } from 'react';
import { Divider, Link, Paper, Typography, useTheme } from '@mui/material';
import { IPerson } from '../types/song.types.ts';
import Grid from '@mui/material/Grid2';
import InfoUrlIcon from './InfoUrlIcon.tsx';
import { personAsString } from './person.utils.ts';

interface IPersonInfoProps {
  person: IPerson;
  imageUrl?: string;
}

const PersonInfo: FC<IPersonInfoProps> = ({ person, imageUrl }) => {
  const theme = useTheme();
  const stageName = person.nickname && (person.forceNickname || person.nickname.includes(' '));

  return (
    <Paper sx={{ padding: '0.5em 1em', marginBottom: '0.5em' }}>
      <div style={{ display: 'flex' }}>
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography lineHeight={1.75} fontWeight="bold">
              Imię
            </Typography>
            {person.secondName && (
              <Typography lineHeight={1.75} fontWeight="bold">
                Drugie imię
              </Typography>
            )}
            <Typography lineHeight={1.75} fontWeight="bold">
              Nazwisko
            </Typography>
            {!stageName && person.nickname && (
              <Typography lineHeight={1.75} fontWeight="bold">
                Pseudonim
              </Typography>
            )}
          </Grid>
          <Grid xs={6}>
            <Typography lineHeight={1.75}>{person.name}</Typography>
            {person.secondName && <Typography lineHeight={1.75}>{person.secondName}</Typography>}
            <Typography lineHeight={1.75}>{person.lastName}</Typography>
            {!stageName && person.nickname && <Typography lineHeight={1.75}>{person.nickname}</Typography>}
          </Grid>
        </Grid>
        {imageUrl && (
          <a href={imageUrl} style={{marginLeft: 'auto'}} target="_blank" rel="noopener"><img
            src={imageUrl}
            style={{
              height: '240px',
              borderRadius: theme.shape.borderRadius,
              border: 'solid',
              borderColor: theme.palette.divider,
            }}
            alt={personAsString(person)}
          /></a>
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
