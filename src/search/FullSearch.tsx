import { useSearchParams } from 'react-router';
import SongList from '../song-list/SongList.tsx';
import {Box} from "@mui/material";

const FullSearch = () => {
  const [params] = useSearchParams();
  const query = params.get('q');

  return (
    <Box width='100%' height='100%'>
      <SongList title={`Wyniki wyszukiwania dla "${query}"`} query={query ?? undefined} />
    </Box>
  );
};

export default FullSearch;
