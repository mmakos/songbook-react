import { IPerson } from '../types/song.types.ts';
import { FC, Fragment } from 'react';
import RouteLink from '../components/RouteLink.tsx';
import { personAsString } from '../author/author.utils.ts';

interface IArtistsTableCellProps {
  artists: IPerson[];
}

const ArtistsTableCell: FC<IArtistsTableCellProps> = ({ artists }) => {
  return (
    <>
      {artists.map((artist, i) => (
        <Fragment key={artist.slug}>
          <RouteLink underline="hover" color="textPrimary" to={`/person/${artist.slug}`}>
            {personAsString(artist)}
          </RouteLink>
          {i < artists.length - 1 && ', '}
        </Fragment>
      ))}
    </>
  );
};

export default ArtistsTableCell;
