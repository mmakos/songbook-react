import { ISource } from '../types/song.types.ts';
import { FC } from 'react';
import RouteLink from '../components/RouteLink.tsx';
import SourceTypeIcon from '../author/SourceTypeIcon.tsx';

interface ISourcesTableCellProps {
  sources: ISource[];
}

const SourcesTableCell: FC<ISourcesTableCellProps> = ({ sources }) => {
  return (
    <>
      {sources.map((source, i) => (
        <span key={source.slug} style={{ display: 'flex', alignItems: 'center' }}>
          <SourceTypeIcon sx={{ mr: '0.3em' }} type={source.type} />
          <RouteLink underline="hover" color="textPrimary" to={`/source/${source.slug}`}>
            {source.name}
          </RouteLink>
          {i < sources.length - 1 && ', '}
        </span>
      ))}
    </>
  );
};

export default SourcesTableCell;
