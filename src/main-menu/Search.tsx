import SearchField from './SearchField.tsx';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { ICategorizedSongOverview } from '../types/song.types.ts';
import { useNavigate } from 'react-router-dom';
import { getAutocomplete } from '../store/songbook.actions.ts';

const Search = () => {
  const { autocomplete, autocompleteLoad } = useAppSelector((state) => state.searchState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        if (inputRef.current) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelection = (_: SyntheticEvent, selectedSong: ICategorizedSongOverview | string | null) => {
    if (!selectedSong) return;
    if (typeof selectedSong === 'string') {
      navigate(`/search?key=${selectedSong}`);
    } else {
      navigate(`/songs/${selectedSong.id}`);
    }
  };

  return (
    <Autocomplete
      autoComplete
      freeSolo
      clearOnBlur
      blurOnSelect
      autoHighlight
      clearOnEscape
      value={''}
      inputValue={query}
      ref={inputRef}
      options={query?.length >= 3 ? (autocomplete ?? []) : []}
      groupBy={(option) => (option as ICategorizedSongOverview).category.name}
      getOptionLabel={(option: ICategorizedSongOverview | string) => (option as ICategorizedSongOverview).title ?? option}
      onChange={handleSelection}
      onInputChange={(_, value) => {
        setQuery(value);
        value.length >= 3 && dispatch(getAutocomplete(value));
      }}
      renderInput={(params) => (
        <SearchField
          {...params}
          inputRef={inputRef}
          placeholder="Szukaj…"
          size="small"
          variant="filled"
          hiddenLabel
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {autocompleteLoad && query?.length >= 3 ? (
                    <CircularProgress color="inherit" size="1.5em" />
                  ) : undefined}
                  {params.InputProps.endAdornment}
                </>
              ),
              startAdornment: <SearchIcon />,
            },
          }}
        />
      )}
    />
  );
};

export default Search;
