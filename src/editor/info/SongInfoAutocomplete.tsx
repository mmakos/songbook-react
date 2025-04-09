import { Autocomplete, Chip, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import useCanEdit from '../../store/useCanEdit.hook.ts';

interface ISongInfoAutocompleteProps<Info extends { slug: string }, Multiple extends boolean | undefined> {
  value: Multiple extends true ? (Info | string)[] : Info | string | null;
  setValue: (value: Multiple extends true ? (Info | string)[] : Info | string | null) => void;
  fixedValues: Multiple extends true ? Info[] : Info | undefined;
  getOptionLabel: (option: Info | string) => string;
  multiple?: Multiple;
  inputLabel: string;
  inputPlaceholder: string;
  getOptions: (query: string, setOptions: (options: Info[]) => void) => void;
  error?: string;
}

const SongInfoAutocomplete = <Info extends { slug: string }, Multiple extends boolean | undefined = false>({
  value,
  setValue,
  fixedValues,
  getOptionLabel,
  multiple,
  inputLabel,
  inputPlaceholder,
  getOptions,
  error,
}: ISongInfoAutocompleteProps<Info, Multiple>) => {
  const [options, setOptions] = useState<Info[]>();
  const [load, setLoad] = useState(false);
  const [query, setQuery] = useState<string>('');
  const { canRemove } = useCanEdit();

  return (
    <Autocomplete
      disabled={!canRemove && !multiple && !!fixedValues}
      limitTags={1}
      multiple={multiple}
      clearOnBlur
      clearOnEscape
      autoHighlight
      value={value}
      onChange={(_, v) => setValue(v)}
      getOptionLabel={getOptionLabel}
      options={query?.length >= 3 && options ? options : []}
      freeSolo
      filterOptions={(options) => {
        if (!Array.isArray(value)) return options;
        return options.filter(
          (opt) => typeof opt == 'string' || !value.find((v) => typeof v !== 'string' && v.slug === opt.slug)
        );
      }}
      filterSelectedOptions
      onInputChange={(_, value) => {
        setQuery(value);
        setLoad(true);
        value.length >= 3 &&
          getOptions(value, (options) => {
            setOptions(options);
            setLoad(false);
          });
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={getOptionLabel(option)}
              {...tagProps}
              disabled={
                !canRemove &&
                typeof option !== 'string' &&
                !!(fixedValues as Info[]).find((o) => o.slug === option.slug)
              }
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={inputLabel}
          placeholder={inputPlaceholder}
          error={!!error}
          helperText={error}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {load && query.length >= 3 && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default SongInfoAutocomplete;
