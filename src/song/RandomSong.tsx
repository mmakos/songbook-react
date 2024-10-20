import { IconButton } from '@mui/material';
import { CasinoOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { HttpService } from '../http/http.service.ts';
import { Category } from '../types/song.types.ts';

const RandomSong = () => {
  const navigate = useNavigate();

  const drawSong = () => {
    HttpService.get(`/random-song/?category=${Category.KACZMARSKI},${Category.OTHER}`).then((result) => {
      navigate(`/song/${result.data}`);
    });
  };

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
