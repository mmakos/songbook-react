import {
  DataGrid,
  GridColDef,
  GridSlots,
  GridSortDirection,
  GridSortModel,
  GridToolbarContainer,
  useGridApiRef,
} from '@mui/x-data-grid';
import { FC, useEffect, useMemo, useState } from 'react';
import { getCategoryDisplayName } from '../category/category.utils.ts';
import muiDataGridPL from '../components/MuiDataGridPL.ts';
import { api } from '../http/api.ts';
import RouteLink from '../components/RouteLink.tsx';
import ArtistsTableCell from './ArtistsTableCell.tsx';
import SourcesTableCell from './SourcesTableCell.tsx';
import { Typography, useTheme } from '@mui/material';
import { Category } from '../types/song.types.ts';
import { useSearchParams } from 'react-router';

const Title: FC<{ title?: string }> = ({ title }) => {
  return (
    <GridToolbarContainer sx={{ background: useTheme().palette.background.paper }}>
      <Typography margin="0.2em 0.2em 0 0.2em" variant="h4">
        {title ?? 'Piosenki'}
      </Typography>
    </GridToolbarContainer>
  );
};

const columns: GridColDef[] = [
  {
    field: 'title',
    minWidth: 200,
    headerName: 'Tytuł',
    renderCell: (params) => (
      <RouteLink underline="hover" color="textPrimary" to={`/song/${params.row.slug}`}>
        {params.value}
      </RouteLink>
    ),
  },
  {
    field: 'category',
    minWidth: 150,
    headerName: 'Kategoria',
    renderCell: (params) => (
      <RouteLink underline="hover" color="textPrimary" to={`/songs/${params.value}`}>
        {getCategoryDisplayName(params.value)}
      </RouteLink>
    ),
  },
  {
    field: 'composer',
    minWidth: 150,
    sortable: false,
    headerName: 'Muzyka',
    renderCell: ({ value }) => value && <ArtistsTableCell artists={value} />,
  },
  {
    field: 'lyrics',
    minWidth: 150,
    sortable: false,
    headerName: 'Słowa',
    renderCell: ({ value }) => value && <ArtistsTableCell artists={value} />,
  },
  {
    field: 'band',
    minWidth: 150,
    headerName: 'Zespół',
    renderCell: ({ value }) =>
      value && (
        <RouteLink underline="hover" color="textPrimary" to={`/band/${value.slug}`}>
          {value.name}
        </RouteLink>
      ),
  },
  {
    field: 'source',
    minWidth: 150,
    sortable: false,
    headerName: 'Źródło',
    renderCell: ({ value }) => value && <SourcesTableCell sources={value} />,
  },
];

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

const SongTable: FC<ISongTableProps> = ({ category, person, band, source, query, title }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);

  const [params, setParams] = useSearchParams();

  const page = strToNumber(params.get('p'), 0);
  const pageSize = strToNumber(params.get('s'), 25);
  const sortField = params.get('f');
  const waiting = params.get('w');
  const sortDir: GridSortDirection = (params.get('o') as GridSortDirection) ?? 'asc';

  const sortModel: GridSortModel = useMemo(() => {
    return sortField ? [{ field: sortField, sort: sortDir }] : [];
  }, [sortField, sortDir]);

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const m = model[0];
      params.set('f', m.field);
      m.sort && params.set('o', m.sort);
    } else {
      params.delete('f');
      params.delete('o');
    }
    setParams(params);
  };

  const apiRef = useGridApiRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      let ordering;
      if (sortModel.length) {
        ordering = sortModel[0].field;
        if (sortModel[0].sort === 'desc') {
          ordering = '-' + ordering;
        }
      }
      const url = query ? `search/` : 'songs/';
      const response = await api.get(url, {
        params: query
          ? { q: query }
          : {
              page: page + 1,
              limit: pageSize,
              ordering: ordering,
              category: category,
              band__slug: band,
              person: person,
              source: source,
              waiting: waiting,
            },
      });
      setSongs(response.data.results);
      setRowCount(response.data.count ?? 0);
      await apiRef.current.autosizeColumns({ expand: true });
    } catch (error) {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, sortField, sortDir, category, band, source, person, query]);

  useEffect(() => {
    apiRef.current.setColumnVisibility('category', !category);
  }, [category]);

  useEffect(() => {
    apiRef.current.setColumnVisibility('band', !band);
  }, [band]);

  return (
    <DataGrid
      apiRef={apiRef}
      disableColumnFilter
      autosizeOptions={{ expand: true }}
      loading={loading}
      rowCount={rowCount}
      columns={columns}
      rows={songs}
      density={pageSize > 25 ? 'compact' : 'standard'}
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'skeleton',
        },
        pagination: {
          page: page,
          rowsPerPage: pageSize,
          slotProps: {
            actions: {
              nextButton: { title: 'Następna strona' },
              previousButton: { title: 'Poprzednia strona' },
            },
          },
          onPageChange: (_, page) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            params.set('p', '' + page);
            setParams(params);
          },
          onRowsPerPageChange: (event) => setParams({ s: event.target.value }),
          labelRowsPerPage: 'Wierszy na stronie',
          labelDisplayedRows: ({ from, to, count }) => `${from}–${to} z ${count >= 0 ? count : 'wielu'}`,
        },
      }}
      localeText={muiDataGridPL}
      paginationMode="server"
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={handleSortModelChange}
      filterMode="server"
      slots={{
        toolbar: (() => <Title title={title} />) as GridSlots['toolbar'],
      }}
    />
  );
};

export default SongTable;
