import { FC, useEffect, useState } from 'react';
import { api } from '../http/api.ts';
import { Category, TSongFullOverview } from '../types/song.types.ts';
import { useSearchParams } from 'react-router';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import SongPagination from './SongPagination.tsx';
import Progress from '../components/Progress.tsx';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { Check, GridView, Sort } from '@mui/icons-material';
import { setSongListGrid } from '../store/songbook.reducer.ts';
import SongsGridView from './SongsGridView.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';
import SongsListView from './SongsListView.tsx';

type TSortDir = 'asc' | 'desc';

interface ISongTableProps {
  category?: Category;
  person?: string;
  band?: string;
  source?: string;
  query?: string;
  title?: string;
}

const strToNumber = (str: string | null, def: number): number => {
  if (!str) return def;
  const number = +str;
  return isNaN(number) ? def : number;
};

const sortModels: ['title' | 'create_time' | 'edit_time', TSortDir, string][] = [
  ['title', 'asc', 'Tytuł: rosnąco'],
  ['title', 'desc', 'Tytuł: malejąco'],
  ['create_time', 'desc', 'Czas dodania: najnowsze'],
  ['create_time', 'asc', 'Czas dodania: najstarsze'],
  ['edit_time', 'desc', 'Czas edycji: najnowsze'],
  ['edit_time', 'asc', 'Czas edycji: najstarsze'],
];

const SongList: FC<ISongTableProps> = ({ category, person, band, source, query, title }) => {
  const songListGrid = useAppSelector((state) => state.songbookSettings.songListGrid);

  const [songs, setSongs] = useState<TSongFullOverview[]>([]);
  const [loading, setLoading] = useState(false);
  const [songsCount, setSongsCount] = useState(0);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLButtonElement>();
  const dispatch = useAppDispatch();

  const [params, setParams] = useSearchParams();
  const page = strToNumber(params.get('p'), 1);
  const pageSize = strToNumber(params.get('s'), 24);
  const sortField = params.get('f') ?? 'title';
  const waiting = params.get('w');
  const sortDir: TSortDir = (params.get('o') as TSortDir) ?? 'asc';

  useEffect(() => {
    fetchSongs();
  }, [page, pageSize, sortField, sortDir, category, band, source, person, waiting, query]);

  const fetchSongs = () => {
    setLoading(true);
    let ordering;
    if (sortField) {
      ordering = sortField;
      if (sortDir === 'desc') {
        ordering = '-' + ordering;
      }
    }
    const url = query ? `search/` : 'songs/';
    api
      .get(url, {
        params: query
          ? { q: query }
          : {
              page: page,
              limit: pageSize,
              ordering: ordering,
              category: category,
              band__slug: band,
              person: person,
              source: source,
              waiting: waiting,
            },
      })
      .then(({ data }) => {
        setSongs(data.results);
        setSongsCount(data.count ?? 0);
      })
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  };

  const sortChanged = (field: string, sortDir: TSortDir) => {
    setSortMenuAnchor(undefined);
    params.set('f', field);
    params.set('o', sortDir);
    setParams(params);
  };

  const pageChanged = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    params.set('p', '' + page);
    setParams(params);
  };

  return (
    <>
      {loading && <Progress />}
      <Stack spacing={2} width="100%">
        <Typography variant="h4">{title ?? 'Piosenki'}</Typography>
        {!!songs.length && (
          <Stack spacing={2} width="100%" position="relative" useFlexGap>
            <Stack direction="row" position={{ sm: 'absolute' }} left={0} top={0}>
              <BasicTooltip title={`Przełącz na widok ${songListGrid ? 'listy' : 'kafelków'}`}>
                <IconButton onClick={() => dispatch(setSongListGrid(!songListGrid))}>
                  {songListGrid ? <ListIcon /> : <GridView />}
                </IconButton>
              </BasicTooltip>
              <BasicTooltip title="Sortowanie">
                <IconButton onClick={(event) => setSortMenuAnchor(event.currentTarget)}>
                  <Sort />
                </IconButton>
              </BasicTooltip>
              <Menu anchorEl={sortMenuAnchor} open={!!sortMenuAnchor} onClose={() => setSortMenuAnchor(undefined)}>
                {sortModels.map((s) => {
                  const selected = s[0] === sortField && s[1] === sortDir;
                  return (
                    <MenuItem onClick={() => sortChanged(s[0], s[1])}>
                      {selected && (
                        <ListItemIcon>
                          <Check />
                        </ListItemIcon>
                      )}
                      <ListItemText inset={!selected}>{s[2]}</ListItemText>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Stack>
            <SongPagination page={page} pageSize={pageSize} songsCount={songsCount} pageChanged={pageChanged} />
            {songListGrid ? <SongsGridView songs={songs} /> : <SongsListView songs={songs} />}
            <SongPagination page={page} pageSize={pageSize} songsCount={songsCount} pageChanged={pageChanged} />
          </Stack>
        )}
        {!songs.length && !loading && (
          <Typography alignSelf="center" variant="h6" color="text.secondary">
            Brak piosenek
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default SongList;
