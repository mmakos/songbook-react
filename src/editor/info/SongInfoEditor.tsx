import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Category, IBand, IPerson, ISource, SourceType } from '../../types/song.types.ts';
import { getCategoryDisplayName } from '../../category/category.utils.ts';
import { personAsString } from '../../author/author.utils.ts';
import Grid from '@mui/material/Grid2';

const authors: IPerson[] = [
  {
    name: 'Michał',
    lastName: 'Makoś',
    nickname: 'Makoś',
    slug: 'michal-makos',
  },
  {
    name: 'Zuzanna',
    secondName: 'Irena',
    lastName: 'Grabowska',
    nickname: 'Sanah',
    forceNickname: true,
    slug: 'sanah',
  },
];

const bands: IBand[] = [
  {
    name: 'Jeleniejaja',
    slug: 'jeleniejaja',
    url: '',
  },
  {
    name: 'Makosie',
    slug: 'makosie',
    url: '',
  },
];

const sources: ISource[] = [
  {
    name: 'Romeo i Julia',
    slug: 'romeo-i-julia',
    type: SourceType.MOVIE,
  },
  {
    name: 'Król Lew',
    slug: 'krol-lew',
    type: SourceType.MUSICAL,
  },
];

interface ValidationErrors {
  title?: string;
  altTitle?: string;
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
  const [title, setTitle] = useState('');
  const [altTitle, setAltTitle] = useState('');
  const [category, setCategory] = useState(Category.OTHER);
  const [lyrics, setLyrics] = useState<(IPerson | string)[]>([]);
  const [composer, setComposer] = useState<(IPerson | string)[]>([]);
  const [translation, setTranslation] = useState<(IPerson | string)[]>([]);
  const [performer, setPerformer] = useState<(IPerson | string)[]>([]);
  const [band, setBand] = useState<IBand | string | null>(null);
  const [source, setSource] = useState<(ISource | string)[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

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
    } else if (title.length > 50) {
      errors.altTitle = 'Tytuł może mieć maksymalnie 50 znaków';
    }
    if (!lyrics.length || !composer.length || !videos.length) {
      errors.minimal = 'Hmm... Może warto podać chociaż autora słów, muzyki i link do nagrania?';
    }
    setValidationErrors(errors);
    return errors;
  };

  const nextStep = () => {
    const errors = validate();
    const errorCount = Object.keys(errors).length;
    // Ten drugi warunek, to jak zostało już tylko ostrzeżenie, które już wcześniej było
    if (errorCount && !(errorCount === 1 && errors.minimal && validationErrors.minimal)) return;
    console.log('NEXT');
  };

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
          <Autocomplete
            limitTags={2}
            multiple
            value={lyrics}
            onChange={(_, v) => setLyrics(v)}
            getOptionLabel={(option) => (typeof option === 'string' ? option : personAsString(option))}
            options={authors}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Autor tekstu" placeholder="Dodaj autora..." />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            limitTags={2}
            multiple
            value={composer}
            onChange={(_, v) => setComposer(v)}
            getOptionLabel={(option) => (typeof option === 'string' ? option : personAsString(option))}
            options={authors}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Autor muzyki" placeholder="Dodaj autora..." />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            limitTags={2}
            multiple
            value={translation}
            onChange={(_, v) => setTranslation(v)}
            getOptionLabel={(option) => (typeof option === 'string' ? option : personAsString(option))}
            options={authors}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Autor tłumacznia" placeholder="Dodaj autora..." />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            limitTags={2}
            value={band}
            onChange={(_, v) => setBand(v)}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={bands}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Zespół" placeholder="Dodaj zespół..." />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            limitTags={2}
            multiple
            value={performer}
            onChange={(_, v) => setPerformer(v)}
            getOptionLabel={(option) => (typeof option === 'string' ? option : personAsString(option))}
            options={authors}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Wykonawca" placeholder="Dodaj wykonawcę..." />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            limitTags={2}
            multiple
            value={source}
            onChange={(_, v) => setSource(v)}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={sources}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Źródło" placeholder="Dodaj źródło..." />}
          />
        </Grid>
        <Grid size={12}>
          <Autocomplete
            limitTags={2}
            multiple
            options={[]}
            value={videos}
            onChange={(_, v) => handleSongVideos(v)}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Link do nagrania (youtube)" placeholder="Dodaj link..." />
            )}
          />
        </Grid>
      </Grid>
      {validationErrors.minimal && <Typography color="warning">{validationErrors.minimal}</Typography>}
      <div style={{ display: 'flex', justifyContent: 'right' }}>
        <Button variant="contained" sx={{ minWidth: '15em' }} size="large" onClick={nextStep}>
          Dalej
        </Button>
      </div>
    </>
  );
};

export default SongInfoEditor;
