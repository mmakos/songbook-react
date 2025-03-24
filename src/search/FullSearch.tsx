import { Paper } from '@mui/material';
import SongTable from '../song-list/SongTable.tsx';
import { useSearchParams } from 'react-router';

const FullSearch = () => {
  const [params] = useSearchParams();
  const query = params.get('q');

  return (
    <Paper sx={{ minHeight: '100%', width: '100%' }}>
      <SongTable title={`Wyniki wyszukiwania dla "${query}"`} query={query ?? undefined} />
    </Paper>
  );
};

export default FullSearch;
