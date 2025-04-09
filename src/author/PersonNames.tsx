import { FC } from 'react';
import { IPerson } from '../types/song.types.ts';
import { Typography } from '@mui/material';

interface IPersonNamesProps {
  person: IPerson;
}

const PersonNames: FC<IPersonNamesProps> = ({ person }) => {
  const stageName = person.nickname && (person.forceNickname || person.nickname.includes(' '));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        columnGap: '1em',
        rowGap: '0.5em',
      }}
    >
      <Typography lineHeight={1.75} fontWeight="bold">
        Imię
      </Typography>
      <Typography lineHeight={1.75}>{person.name}</Typography>
      {person.secondName && (
        <>
          <Typography lineHeight={1.75} fontWeight="bold">
            Drugie imię
          </Typography>
          <Typography lineHeight={1.75}>{person.secondName}</Typography>
        </>
      )}
      <Typography lineHeight={1.75} fontWeight="bold">
        Nazwisko
      </Typography>
      <Typography lineHeight={1.75}>{person.lastName}</Typography>
      {!stageName && person.nickname && (
        <>
          <Typography lineHeight={1.75} fontWeight="bold">
            Pseudonim
          </Typography>
          <Typography lineHeight={1.75}>{person.nickname}</Typography>
        </>
      )}
    </div>
  );
};

export default PersonNames;
