import { DataGrid, GridColDef, GridSlots, GridSortModel, GridToolbarContainer, useGridApiRef } from '@mui/x-data-grid';
import { FC, useEffect, useState } from 'react';
import { getCategoryDisplayName } from '../category/category.utils.ts';
import muiDataGridPL from '../components/MuiDataGridPL.ts';
import { HttpService } from '../http/http.service.ts';
import RouteLink from '../components/RouteLink.tsx';
import ArtistsTableCell from './ArtistsTableCell.tsx';
import SourcesTableCell from './SourcesTableCell.tsx';
import { Typography, useTheme } from '@mui/material';
import { Category } from '../types/song.types.ts';

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

const SongTable: FC<ISongTableProps> = ({ category, person, band, source, query, title }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'title', sort: 'asc' }]);

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
      const response = await HttpService.get(
        url,
        query
          ? { q: query }
          : {
              page: page + 1,
              limit: pageSize,
              ordering: ordering,
              category: category,
              band__slug: band,
              person: person,
              source: source,
            }
      );
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
  }, [page, pageSize, sortModel, category, band, source, person, query]);

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
            setPage(page);
          },
          onRowsPerPageChange: (event) => setPageSize(+event.target.value),
          labelRowsPerPage: 'Wierszy na stronie',
          labelDisplayedRows: ({ from, to, count }) => `${from}–${to} z ${count >= 0 ? count : 'wielu'}`,
        },
      }}
      localeText={muiDataGridPL}
      paginationMode="server"
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      filterMode="server"
      slots={{
        toolbar: (() => <Title title={title} />) as GridSlots['toolbar'],
      }}
    />
  );
};

export default SongTable;
