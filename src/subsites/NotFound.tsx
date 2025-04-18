import {Stack, Typography} from '@mui/material';
import RouteLink from '../components/RouteLink.tsx';

const drawSadEmoji = () => {
  let code: number = Math.floor(Math.random() * 29) + 128528;
  if (code > 128534) code += 7;
  return String.fromCodePoint(code);
};

const NotFound = () => {
  return (
    <Stack alignItems='center'>
      <Typography variant="h1">4{drawSadEmoji()}4</Typography>
      <Typography variant="h3" mb="1em" mt="0.3em">
        Nie ma takiej piosenki!
      </Typography>
      <RouteLink to={'/song/epitafium-dla-sergiusza-jesienina'} variant="h4">
        No to śpiewamy „Epitafium dla Sergiusza Jesienina”
      </RouteLink>
    </Stack>
  );
};

export default NotFound;
