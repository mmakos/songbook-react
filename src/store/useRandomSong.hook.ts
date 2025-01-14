import { useNavigate } from 'react-router-dom';
import { HttpService } from '../http/http.service.ts';
import { Category } from '../types/song.types.ts';

const useRandomSong = (): (() => void) => {
  const navigate = useNavigate();

  return () => {
    HttpService.get(`/random-song/?category=${Category.KACZMARSKI},${Category.OTHER}`).then((result) => {
      navigate(`/song/${result.data}`);
    });
  };
};

export default useRandomSong;
