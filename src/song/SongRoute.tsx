import RouteLink from '../components/RouteLink.tsx';
import { Home, MusicNote } from '@mui/icons-material';
import CategoryIcon from '../category/CategoryIcon.tsx';
import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import { getCategoryDisplayName } from '../category/category.utils.ts';
import { FC } from 'react';
import { ISong } from '../types/song.types.ts';

const SongRoute: FC<{ song?: ISong }> = ({ song }) => {
  return (
    <Breadcrumbs sx={{ mb: '0.5em' }}>
      <RouteLink to="/" underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
        <Home sx={{ mr: '0.3em' }} fontSize="inherit" />
        Śpiewnik
      </RouteLink>
      <RouteLink to="/songs" underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
        <MusicNote sx={{ mr: '0.3em' }} fontSize="inherit" />
        Piosenki
      </RouteLink>
      {song ? (
        <RouteLink
          to={`/songs/${song.category}`}
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <CategoryIcon category={song.category} sx={{ mr: '0.3em' }} fontSize="inherit" />
          {getCategoryDisplayName(song.category)}
        </RouteLink>
      ) : (
        <Skeleton width="7em" />
      )}
      {song ? <Typography sx={{ color: 'text.primary' }}>{song.title}</Typography> : <Skeleton width="10em" />}
    </Breadcrumbs>
  );
};

export default SongRoute;
