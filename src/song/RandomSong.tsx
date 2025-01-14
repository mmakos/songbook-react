import { IconButton } from '@mui/material';
import { CasinoOutlined } from '@mui/icons-material';
import useRandomSong from '../store/useRandomSong.hook.ts';

const RandomSong = () => {
  const drawSong = useRandomSong();

  return (
    <IconButton
      onClick={drawSong}
      color="inherit"
      sx={{
        ':hover': {
          transform: 'rotate(720deg)',
          transition: 'transform 1s',
        },
      }}
    >
      <CasinoOutlined />
    </IconButton>
  );
};

export default RandomSong;
