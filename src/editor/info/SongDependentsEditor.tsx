import { EditedDependent, ISongInfo, useSongEditContext } from '../SongEditContext.tsx';
import Grid from '@mui/material/Grid2';
import SongBandEditor, { IBandValidationErrors, validateBand } from './SongBandEditor.tsx';
import { IBand, IPerson, ISource, SourceType } from '../../types/song.types.ts';
import { useState } from 'react';
import { parsePersonName } from '../../author/author.utils.ts';
import SongSourceEditor, { ISourceValidationErrors, validateSource } from './SongSourceEditor.tsx';
import SongPersonEditor from './SongPersonEditor.tsx';
import { Button, Typography } from '@mui/material';
import { BackspaceOutlined, Check } from '@mui/icons-material';

const mapBandDependent = (band?: string | EditedDependent<IBand> | null): EditedDependent<IBand> | undefined => {
  if (typeof band === 'string') {
    return {
      name: band,
      slug: '',
      edited: true,
    };
  } else if (band?.edited) {
    return band;
  }
};

const mapPeopleDependents = (songInfo?: ISongInfo) => {
  const people: Record<string, EditedDependent<IPerson>> = {};
  [songInfo?.lyrics, songInfo?.composer, songInfo?.performer, songInfo?.translation].forEach((list) =>
    list?.forEach((l) => {
      if (typeof l === 'string') {
        people[l] = parsePersonName(l);
        people[l].edited = true;
      } else if (l?.edited) {
        people[l.name] = l;
      }
    })
  );

  return people;
};

const mapSourceDependants = (sourceDependants?: (EditedDependent<ISource> | string)[]) => {
  const sources: Record<string, EditedDependent<ISource>> = {};
  sourceDependants?.forEach((s) => {
    if (typeof s === 'string') {
      sources[s] = {
        slug: '',
        name: s,
        type: SourceType.MUSICAL,
        edited: true,
      };
    } else if (s?.edited) {
      sources[s.name] = s;
    }
  });
  return sources;
};

const SongDependentsEditor = () => {
  const { songInfo, setSongInfo, updateStep } = useSongEditContext();
  const [band, setBand] = useState(() => mapBandDependent(songInfo?.band));
  const [bandErrors, setBandErrors] = useState<IBandValidationErrors>();

  const [people, setPeople] = useState(() => mapPeopleDependents(songInfo));

  const [sources, setSources] = useState(() => mapSourceDependants(songInfo?.source));
  const [sourceErrors, setSourceErrors] = useState<Record<string, ISourceValidationErrors>>();

  const setSource = (name: string, source: ISource) => {
    setSources({ ...sources, [name]: source });
  };

  const setPerson = (name: string, person: IPerson) => {
    setPeople({ ...people, [name]: person });
  };

  const deletePerson = (name: string) => {
    if (people) {
      delete people[name];
      setPeople({ ...people });
    }
  };

  const deleteSource = (name: string) => {
    if (sources) {
      delete sources[name];
      setSources({ ...sources });
    }
  };

  const deleteBand = () => {
    setBand(undefined);
  };

  const validate = () => {
    let bandErr = undefined;
    if (band) {
      bandErr = validateBand(band);
      setBandErrors(bandErr);
    }
    let sourceErr: Record<string, ISourceValidationErrors> | undefined = {};
    Object.entries(sources).forEach(([name, source]) => {
      const errs = validateSource(source);
      if (errs) sourceErr![name] = errs;
    });
    if (!Object.keys(sourceErr).length) sourceErr = undefined;
    setSourceErrors(sourceErr);

    return !sourceErr && !bandErr;
  };

  const updateSongInfo = () => {
    if (songInfo) {
      if (band) songInfo.band = band;
      Object.entries(sources).forEach(([name, source]) => {
        const idx = songInfo.source.indexOf(name);
        if (idx >= 0) songInfo.source[idx] = source;
      });
      Object.entries(people).forEach(([name, person]) => {
        let idx = songInfo.lyrics.indexOf(name);
        if (idx >= 0) songInfo.lyrics[idx] = person;
        idx = songInfo.composer.indexOf(name);
        if (idx >= 0) songInfo.composer[idx] = person;
        idx = songInfo.translation.indexOf(name);
        if (idx >= 0) songInfo.translation[idx] = person;
        idx = songInfo.performer.indexOf(name);
        if (idx >= 0) songInfo.performer[idx] = person;
      });
      setSongInfo({ ...songInfo });
    }
  };

  const handleNextStep = () => {
    const validationResult = validate();
    if (validationResult) {
      updateSongInfo();
    }
    updateStep(1);
  };

  const handlePreviousStep = () => {
    updateSongInfo();
    updateStep(-1);
  };

  return (
    <>
      <Grid container columnSpacing={4} rowSpacing={4}>
        {Object.entries(people).map(([name, person]) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`person-${name}`}>
            <SongPersonEditor
              personName={name}
              person={person}
              setPerson={(p) => setPerson(name, p)}
              deletePerson={() => deletePerson(name)}
            />
          </Grid>
        ))}
        {Object.entries(sources).map(([name, source]) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`source-${name}`}>
            <SongSourceEditor
              sourceName={name}
              source={source}
              setSource={(s) => setSource(name, s)}
              deleteSource={() => deleteSource(name)}
              errors={sourceErrors?.[name]}
            />
          </Grid>
        ))}
        {band && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <SongBandEditor
              bandName={songInfo!.band as string}
              band={band}
              setBand={setBand}
              deleteBand={deleteBand}
              errors={bandErrors}
            />
          </Grid>
        )}
      </Grid>
      <Typography color="warning">
        Fajnie jakbyś wprowadził jakieś dodatkowe dane (zwłaszcza linki), ale jak teraz nie masz czasu, to możesz to
        pominąć i uzupełnić kiedy indziej.
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'right', gap: '1em' }}>
        <Button variant="outlined" size="large" onClick={handlePreviousStep} startIcon={<BackspaceOutlined />}>
          Wróć
        </Button>
        <Button variant="contained" size="large" onClick={handleNextStep} endIcon={<Check />}>
          Dalej
        </Button>
      </div>
    </>
  );
};
export default SongDependentsEditor;
