import { FC, Fragment } from 'react';
import { IVerse } from '../../types/song.types.ts';
import LineChords from './LineChords.tsx';

interface IVerseChordsProps {
  verse: IVerse;
}

const VerseChords: FC<IVerseChordsProps> = ({ verse }) => {
  return (
    <>
      {verse.lines.map((line, i) => (
        <Fragment key={'l' + i}><LineChords line={line} /></Fragment>
      ))}
    </>
  );
};

export default VerseChords;
