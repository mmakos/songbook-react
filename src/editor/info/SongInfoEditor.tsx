import {
  Autocomplete,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Category, IBand, IPerson, ISongEdit, ISource } from '../../types/song.types.ts';
import { getCategoryDisplayName } from '../../category/category.utils.ts';
import { personAsString } from '../../author/author.utils.ts';
import Grid from '@mui/material/Grid2';
import { useSongEditContext } from '../SongEditContext.tsx';
import SongInfoAutocomplete from './SongInfoAutocomplete.tsx';
import { getBandAutocomplete, getPersonAutocomplete, getSourceAutocomplete } from './autocomplete.actions.ts';
import { RestartAlt, Start } from '@mui/icons-material';
import useCanEdit from '../../store/useCanEdit.hook.ts';
import { getPersonFromSongEdit, splitToNewAndExistingPerson } from '../person/person.mapper.ts';
import { getSourceFromSongEdit, splitToNewAndExistingSource } from '../source/source.mapper.ts';
import { getBandFromSongEdit, splitToNewAndExistingBand } from '../band/band.mapper.ts';

interface ValidationErrors {
  title?: string;
  altTitle?: string;
  lyrics?: string;
  composer?: string;
  translation?: string;
  performer?: string;
  source?: string;
  videos?: string;
  minimal?: string;
}

const extractYoutubeLink = (url: string) => {
  if (RegExp(/^[\w-]{11}$/).exec(url)) return url;
  let match = RegExp(/youtu\.be\/([\w-]{11})(?:\?|$)/).exec(url);
  if (match?.[1]) return match[1];
  match = RegExp(/youtube\.com\/watch\?v=([\w-]{11})(?:&|$)/).exec(url);
  if (match?.[1]) return match[1];
};

const SongInfoEditor = () => {
  const { song, setNeedsAuthorEdit, songEdit, setSongEdit, updateStep, resetSongInfo } = useSongEditContext();
  const { canRemove } = useCanEdit();

  const [title, setTitle] = useState(songEdit.title);
  const [altTitle, setAltTitle] = useState(songEdit?.altTitle ?? '');
  const [category, setCategory] = useState(songEdit.category);
  const [lyrics, setLyrics] = useState<(IPerson | string)[]>(getPersonFromSongEdit(songEdit.lyrics, song.lyrics));
  const [composer, setComposer] = useState<(IPerson | string)[]>(
    getPersonFromSongEdit(songEdit.composer, song.composer)
  );
  const [translation, setTranslation] = useState<(IPerson | string)[]>(
    getPersonFromSongEdit(songEdit.translation, song.translation)
  );
  const [performer, setPerformer] = useState<(IPerson | string)[]>(
    getPersonFromSongEdit(songEdit.performer, song.performer)
  );
  const [band, setBand] = useState<IBand | string | null>(() => getBandFromSongEdit(songEdit.band, song.band));
  const [source, setSource] = useState<(ISource | string)[]>(getSourceFromSongEdit(songEdit.source, song.source));
  const [videos, setVideos] = useState<string[]>(songEdit.video ?? []);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    setNeedsAuthorEdit(
      !!lyrics.find((v) => typeof v === 'string') ||
        !!composer.find((v) => typeof v === 'string') ||
        !!translation.find((v) => typeof v === 'string') ||
        !!performer.find((v) => typeof v === 'string') ||
        !!source.find((v) => typeof v === 'string') ||
        typeof band === 'string'
    );
  }, [lyrics, composer, translation, performer, band, source]);

  const handleSongVideos = (vids: string[]) => {
    setVideos(vids.map(extractYoutubeLink).filter((v) => v !== undefined));
  };

  const validate = () => {
    const errors: ValidationErrors = {};
    if (title.length < 3) {
      errors.title = 'Tytuł musi mieć przynajmniej 3 znaki';
    } else if (title.length > 50) {
      errors.title = 'Tytuł może mieć maksymalnie 50 znaków';
    }
    if (altTitle.length > 0 && altTitle.length < 3) {
      errors.altTitle = 'Tytuł musi mieć przynajmniej 3 znaki';
    } else if (altTitle.length > 50) {
      errors.altTitle = 'Tytuł może mieć maksymalnie 50 znaków';
    }
    if (lyrics.length > 5) errors.source = 'Możesz podać maksymalnie 5 autorów tekstu';
    if (composer.length > 5) errors.composer = 'Możesz podać maksymalnie 5 autorów muzyki';
    if (translation.length > 5) errors.translation = 'Możesz podać maksymalnie 3 autorów tłumacznia';
    if (performer.length > 5) errors.performer = 'Możesz podać maksymalnie 5 wykonawców';
    if (source.length > 3) errors.source = 'Możesz podać maksymalnie 3 źródła piosenki';
    if (videos.length > 3) errors.videos = 'Możesz podać maksymalnie 3 nagrania';
    if (!lyrics.length || !composer.length || !videos.length) {
      errors.minimal = 'Hmm... Może warto podać chociaż autora słów, muzyki i link do nagrania?';
    }
    setValidationErrors(errors);
    return errors;
  };

  const handleNextStep = () => {
    const errors = validate();
    const errorCount = Object.keys(errors).length;
    // Ten drugi warunek, to jak zostało już tylko ostrzeżenie, które już wcześniej było
    if (errorCount && !(errorCount === 1 && errors.minimal && validationErrors.minimal)) return;

    const lyricsSplit = splitToNewAndExistingPerson(lyrics, songEdit.lyrics);
    if (lyricsSplit) songEdit.lyrics = lyricsSplit;
    else delete songEdit.lyrics;
    const composerSplit = splitToNewAndExistingPerson(composer, songEdit.composer);
    if (composerSplit) songEdit.composer = composerSplit;
    else delete songEdit.composer;
    const translationSplit = splitToNewAndExistingPerson(translation, songEdit.translation);
    if (translationSplit) songEdit.translation = translationSplit;
    else delete songEdit.translation;
    const performerSplit = splitToNewAndExistingPerson(performer, songEdit.performer);
    if (performerSplit) songEdit.performer = performerSplit;
    else delete songEdit.performer;

    const sourceSplit = splitToNewAndExistingSource(source, songEdit.source);
    if (sourceSplit) songEdit.source = sourceSplit;
    else delete songEdit.source;

    const bandSplit = splitToNewAndExistingBand(band, songEdit.band);
    if (bandSplit) songEdit.band = bandSplit;
    else delete songEdit.band;

    const newEdit: ISongEdit = { ...songEdit, title, altTitle, category, video: videos };
    if (!altTitle.trim().length) delete newEdit.altTitle;
    if (!videos.length) delete newEdit.video;
    setSongEdit(newEdit);
    updateStep(1);
  };

  return (
    <>
      {!canRemove && (
        <Typography color="info" variant="caption">
          Tylko zweryfikowani użytkownicy mają dostęp do pełnej edycji (usuwanie autorów, zmiana tytułu itd.)
        </Typography>
      )}
      <Grid container columnSpacing={2} rowSpacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            label="Tytuł piosenki"
            required
            disabled={!canRemove}
            error={!!validationErrors.title}
            helperText={validationErrors.title}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            label="Alternatywny tytuł"
            disabled={!canRemove && !!song.altTitle}
            error={!!validationErrors.altTitle}
            helperText={validationErrors.altTitle}
            value={altTitle}
            onChange={(event) => setAltTitle(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Kategoria</InputLabel>
            <Select
              variant="outlined"
              label="Kategoria"
              disabled={!canRemove}
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {Object.values(Category).map((c) => (
                <MenuItem key={c} value={c}>
                  {getCategoryDisplayName(c)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SongInfoAutocomplete
            multiple
            value={lyrics}
            setValue={setLyrics}
            fixedValues={song.lyrics ?? []}
            error={validationErrors.lyrics}
            getOptionLabel={(option) => (typeof option === 'string' ? option : personAsString(option))}
            getOptions={getPersonAutocomplete}
            inputLabel="Autor tekstu"
            inputPlaceholder="Dodaj autora..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SongInfoAutocomplete
            multiple
            value={composer}
            setValue={setComposer}
            fixedValues={song.composer ?? []}
            error={validationErrors.composer}
            getOptionLabel={(option) => (typeof option === 'string' ? option : personAsString(option))}
            getOptions={getPersonAutocomplete}
            inputLabel="Autor muzyki"
            inputPlaceholder="Dodaj autora..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SongInfoAutocomplete
            multiple
            value={translation}
            setValue={setTranslation}
            fixedValues={song.translation ?? []}
            error={validationErrors.translation}
            getOptionLabel={(option) => (typeof option === 'string' ? option : personAsString(option))}
            getOptions={getPersonAutocomplete}
            inputLabel="Autor tłumacznia"
            inputPlaceholder="Dodaj autora..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SongInfoAutocomplete
            value={band}
            setValue={setBand}
            fixedValues={song.band}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            getOptions={getBandAutocomplete}
            inputLabel="Zespół"
            inputPlaceholder="Dodaj zespół..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SongInfoAutocomplete
            multiple
            value={performer}
            setValue={setPerformer}
            fixedValues={song.performer ?? []}
            error={validationErrors.performer}
            getOptionLabel={(option) => (typeof option === 'string' ? option : personAsString(option))}
            getOptions={getPersonAutocomplete}
            inputLabel="Wykonawca"
            inputPlaceholder="Dodaj wykonawcę..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SongInfoAutocomplete
            multiple
            value={source}
            setValue={setSource}
            fixedValues={song.source ?? []}
            error={validationErrors.source}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            getOptions={getSourceAutocomplete}
            inputLabel="Skąd jest piosenka"
            inputPlaceholder="Dodaj źródło..."
          />
        </Grid>
        <Grid size={12}>
          <Autocomplete
            limitTags={3}
            multiple
            clearOnBlur
            clearOnEscape
            options={[]}
            value={videos}
            onChange={(_, v) => handleSongVideos(v)}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!validationErrors.videos}
                helperText={validationErrors.videos}
                label="Link do nagrania (youtube)"
                placeholder="Dodaj link..."
              />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    {...tagProps}
                    disabled={!canRemove && !!song.video?.includes(option)}
                  />
                );
              })
            }
          />
        </Grid>
      </Grid>
      {validationErrors.minimal && <Typography color="warning">{validationErrors.minimal}</Typography>}
      <Stack direction="row" justifyContent="right" gap={1}>
        <Button variant="outlined" size="large" onClick={resetSongInfo} startIcon={<RestartAlt />}>
          Resetuj
        </Button>
        <Button variant="contained" size="large" onClick={handleNextStep} endIcon={<Start />}>
          Dalej
        </Button>
      </Stack>
    </>
  );
};

export default SongInfoEditor;
