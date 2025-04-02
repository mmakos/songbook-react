import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Category, IBand, IPerson, ISource } from '../../types/song.types.ts';
import { getCategoryDisplayName } from '../../category/category.utils.ts';
import { personAsString } from '../../author/author.utils.ts';
import Grid from '@mui/material/Grid2';
import { EditedDependent, useSongEditContext } from '../SongEditContext.tsx';
import SongInfoAutocomplete from './SongInfoAutocomplete.tsx';
import { getBandAutocomplete, getPersonAutocomplete, getSourceAutocomplete } from './autocomplete.actions.ts';
import { RestartAlt, Start } from '@mui/icons-material';
import NotFound from '../../subsites/NotFound.tsx';
import Progress from '../../components/Progress.tsx';

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
  const { song, songTimeout, songInfo, setNeedsAuthorEdit, setSongInfo, updateStep, initial, setInitial } =
    useSongEditContext();

  const [title, setTitle] = useState(songInfo?.title ?? '');
  const [altTitle, setAltTitle] = useState(songInfo?.altTitle ?? '');
  const [category, setCategory] = useState(songInfo?.category ?? Category.OTHER);
  const [lyrics, setLyrics] = useState<(EditedDependent<IPerson> | string)[]>(songInfo?.lyrics ?? []);
  const [composer, setComposer] = useState<(EditedDependent<IPerson> | string)[]>(songInfo?.composer ?? []);
  const [translation, setTranslation] = useState<(EditedDependent<IPerson> | string)[]>(songInfo?.translation ?? []);
  const [performer, setPerformer] = useState<(EditedDependent<IPerson> | string)[]>(songInfo?.performer ?? []);
  const [band, setBand] = useState<EditedDependent<IBand> | string | null>(songInfo?.band ?? null);
  const [source, setSource] = useState<(EditedDependent<ISource> | string)[]>(songInfo?.source ?? []);
  const [videos, setVideos] = useState<string[]>(songInfo?.videos ?? []);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (initial) {
      resetFromSong();
      setInitial(false);
    }
  }, [song, initial]);

  useEffect(() => {
    setNeedsAuthorEdit(
      !!lyrics.find((v) => typeof v === 'string' || v.editing) ||
        !!composer.find((v) => typeof v === 'string' || v.editing) ||
        !!translation.find((v) => typeof v === 'string' || v.editing) ||
        !!performer.find((v) => typeof v === 'string' || v.editing) ||
        !!source.find((v) => typeof v === 'string' || v.editing) ||
        typeof band === 'string' ||
        !!band?.editing
    );
  }, [lyrics, composer, translation, performer, band, source]);

  const resetFromSong = () => {
    if (song) {
      setTitle(song.title);
      setAltTitle(song.altTitle ?? '');
      setCategory(song.category);
      setLyrics(song.lyrics ?? []);
      setComposer(song.composer ?? []);
      setTranslation(song.translation ?? []);
      setPerformer(song.performer ?? []);
      setBand(song.band ?? null);
      setSource(song.source ?? []);
      setVideos(song.video ?? []);
    }
  };

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
    setSongInfo({ altTitle, band, category, composer, lyrics, performer, source, title, translation, videos });
    updateStep(1);
  };

  if (!song) {
    if (songTimeout) {
      return <NotFound />;
    } else {
      return <Progress />;
    }
  }

  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            fullWidth
            label="Tytuł piosenki"
            required
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
          />
        </Grid>
      </Grid>
      {validationErrors.minimal && <Typography color="warning">{validationErrors.minimal}</Typography>}
      <Stack direction="row" justifyContent="right" gap={1}>
        <Button variant="outlined" size="large" onClick={resetFromSong} startIcon={<RestartAlt />}>
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
