import { Typography } from '@mui/material';
import RouteLink from '../components/RouteLink.tsx';

const NotFound = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant='h1'>404</Typography>
      <RouteLink to={'/song/epitafium-dla-sergiusza-jesienina'} variant='h4'>No to śpiewamy Epitafium dla Sergiusza Jesienina</RouteLink>
    </div>
  );
};

export default NotFound;
