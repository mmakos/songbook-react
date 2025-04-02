import { useNavigate } from 'react-router-dom';
import { api } from '../http/api.ts';
import { Category } from '../types/song.types.ts';

const useRandomSong = (): (() => void) => {
  const navigate = useNavigate();

  return () => {
    api.get(`/random-song/?category=${Category.KACZMARSKI},${Category.OTHER}`).then((result) => {
      navigate(`/song/${result.data}`);
    });
  };
};

export default useRandomSong;
