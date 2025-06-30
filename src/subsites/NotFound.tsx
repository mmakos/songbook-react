import { Stack, Typography } from '@mui/material';
import RouteLink from '../components/RouteLink.tsx';
import { FC, PropsWithChildren } from 'react';
import BasicHelmet from './BasicHelmet.tsx';

const drawSadEmoji = () => {
  let code: number = Math.floor(Math.random() * 29) + 128528;
  if (code > 128534) code += 7;
  return String.fromCodePoint(code);
};

const NotFound: FC<PropsWithChildren & { text?: string }> = ({ children, text }) => {
  const finalText = !text && !children ? 'Nie ma takiej piosenki!' : text;

  return (
    <Stack alignItems="center">
      <BasicHelmet title='404'/>
      <Typography variant="h1">4{drawSadEmoji()}4</Typography>
      {finalText && (
        <Typography variant="h3" mb="1em" mt="0.3em">
          {finalText}
        </Typography>
      )}
      {children ||
        (!text && (
          <RouteLink to={'/song/epitafium-dla-sergiusza-jesienina'} variant="h4">
            No to śpiewamy „Epitafium dla Sergiusza Jesienina”
          </RouteLink>
        ))}
    </Stack>
  );
};

export default NotFound;
