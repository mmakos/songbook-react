import SearchField from './SearchField.tsx';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, CircularProgress } from '@mui/material';
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoryDisplayName } from '../category/category.utils.ts';
import { autocompleteSearchItems, getSearchItemUrl, ISearchItem } from './search.utils.ts';
import { IFastSearch } from './search.types.ts';
import { getAutocomplete } from './search.actions.ts';

const Search = () => {
  const [autocomplete, setAutocomplete] = useState<IFastSearch>();
  const [load, setLoad] = useState(false);
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

  const autocompleteItems = useMemo(() => {
    return autocomplete ? autocompleteSearchItems(autocomplete) : [];
  }, [autocomplete]);

  const handleSelection = (_: SyntheticEvent, selectedSong: ISearchItem | string | null) => {
    if (!selectedSong) return;
    if (typeof selectedSong === 'string') {
      navigate(`/search?q=${selectedSong}`);
    } else {
      navigate(getSearchItemUrl(selectedSong));
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
      sx={{ width: { xs: '100%', md: 'auto' }, mr: { xs: '2em', sm: '0' } }}
      value={''}
      inputValue={query}
      filterOptions={(x) => x}
      options={query?.length >= 3 ? autocompleteItems : []}
      groupBy={(option) => getCategoryDisplayName((option as ISearchItem).category)}
      getOptionLabel={(option: ISearchItem | string) => (option as ISearchItem).displayName ?? option}
      onChange={handleSelection}
      onInputChange={(_, value) => {
        setQuery(value);
        setLoad(false);
        value.length >= 3 &&
          getAutocomplete(value, (autocomplete) => {
            setAutocomplete(autocomplete);
            setLoad(false);
          });
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
                  {load && query?.length >= 3 ? <CircularProgress color="inherit" size="1.5em" /> : undefined}
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
