import { FC } from 'react';
import { Pagination } from '@mui/material';

interface ISongPaginationProps {
  page: number;
  pageChanged: (page: number) => void;
  pageSize: number;
  songsCount: number;
}

const SongPagination: FC<ISongPaginationProps> = ({ page, pageChanged, pageSize, songsCount }) => {
  return (
    <Pagination
      page={page}
      color='primary'
      count={Math.ceil(songsCount / pageSize)}
      onChange={(_, page) => pageChanged(page)}
      sx={{ alignSelf: 'center' }}
    />
  );
};

export default SongPagination;
