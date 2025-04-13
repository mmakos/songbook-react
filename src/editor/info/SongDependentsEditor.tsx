import { EditedDependent, useSongEditContext } from '../SongEditContext.tsx';
import Grid from '@mui/material/Grid2';
import SongBandEditor, { IBandValidationErrors, validateBand } from '../band/SongBandEditor.tsx';
import { IPersonData, ISongEdit, ISourceData } from '../../types/song.types.ts';
import { useState } from 'react';
import SongSourceEditor, { ISourceValidationErrors, validateSource } from '../source/SongSourceEditor.tsx';
import SongPersonEditor, { IPersonValidationErrors, validatePerson } from '../person/SongPersonEditor.tsx';
import { Button, Stack, Typography } from '@mui/material';
import { BackspaceOutlined, Check } from '@mui/icons-material';
import { IEditedPerson } from '../person/person.mapper.ts';

const mapPeopleDependents = (songEdit: ISongEdit) => {
  const people: Record<string, IPersonData> = {};
  [songEdit.lyrics?.new, songEdit.composer?.new, songEdit.performer?.new, songEdit.translation?.new].forEach((list) =>
    list?.forEach((p) => {
      people[p.id] = p;
    })
  );

  return people;
};

const mapSourceDependants = (sourcesEdit?: ISourceData[]) => {
  const sources: Record<string, ISourceData> = {};
  sourcesEdit?.forEach((s) => {
    sources[s.name] = s;
  });
  return sources;
};

const updatePeople = (listToUpdate: IEditedPerson[] | undefined, people: Record<string, IPersonData>) => {
  if (!listToUpdate) return;
  for (let i = listToUpdate.length - 1; i >= 0; --i) {
    const id = listToUpdate[i].id;
    const newPerson = people[id];
    if (newPerson) listToUpdate[i] = { ...newPerson, id };
    else listToUpdate.splice(i, 1);
  }
};

const SongDependentsEditor = () => {
  const { songEdit, setSongEdit, updateStep } = useSongEditContext();
  const [band, setBand] = useState(songEdit.band?.new);
  const [bandErrors, setBandErrors] = useState<IBandValidationErrors>();

  const [people, setPeople] = useState(() => mapPeopleDependents(songEdit));
  const [personErrors, setPersonErrors] = useState<Record<string, IPersonValidationErrors>>();

  const [sources, setSources] = useState(() => mapSourceDependants(songEdit.source?.new));
  const [sourceErrors, setSourceErrors] = useState<Record<string, ISourceValidationErrors>>();

  const setSource = (name: string, source: ISourceData) => {
    setSources({ ...sources, [name]: source });
  };

  const setPerson = (id: string, person: IPersonData) => {
    setPeople({ ...people, [id]: person });
  };

  const deletePerson = (id: string) => {
    if (people) {
      delete people[id];
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

  const validateList = <T extends object, R extends object>(
    list: Record<string, EditedDependent<R>>,
    validator: (r: R) => T | undefined
  ) => {
    let errors: Record<string, T> | undefined = {};
    Object.entries(list).forEach(([name, r]) => {
      const errs = validator(r);
      if (errs) errors![name] = errs;
    });
    if (!Object.keys(errors).length) errors = undefined;

    return errors;
  };

  const validate = () => {
    let bandErr = undefined;
    if (band) {
      bandErr = validateBand(band);
      setBandErrors(bandErr);
    }

    const sourceErr = validateList(sources, validateSource);
    setSourceErrors(sourceErr);

    const personErr = validateList(people, validatePerson);
    setPersonErrors(personErr);

    return !personErr && !sourceErr && !bandErr;
  };

  const updateSongEdit = () => {
    if (band) songEdit.band = { new: band };
    else delete songEdit.band;

    if (songEdit.source) {
      if (Object.keys(sources).length) songEdit.source.new = Object.values(sources);
      else {
        delete songEdit.source.new;
        if (!songEdit.source.existing) delete songEdit.source;
      }
    }

    updatePeople(songEdit.lyrics?.new, people);
    updatePeople(songEdit.composer?.new, people);
    updatePeople(songEdit.translation?.new, people);
    updatePeople(songEdit.performer?.new, people);

    setSongEdit({ ...songEdit });
  };

  const handleNextStep = () => {
    const validationResult = validate();
    if (validationResult) {
      updateSongEdit();
    }
    updateStep(1);
  };

  const handlePreviousStep = () => {
    updateSongEdit();
    updateStep(-1);
  };

  return (
    <>
      <Grid container columnSpacing={4} rowSpacing={4}>
        {Object.entries(people).map(([id, person]) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`person-${id}`}>
            <SongPersonEditor
              title={`Edytuj osobę „${id}”`}
              person={person}
              setPerson={(p) => setPerson(id, p)}
              deletePerson={() => deletePerson(id)}
              errors={personErrors?.[id]}
            />
          </Grid>
        ))}
        {Object.entries(sources).map(([name, source]) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`source-${name}`}>
            <SongSourceEditor
              title={`Edytuj źródło „${name}”`}
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
              title={`Edytuj zespół „${songEdit.band?.new?.name}”`}
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
      <Stack direction="row" gap={1} justifyContent="right">
        <Button variant="outlined" size="large" onClick={handlePreviousStep} startIcon={<BackspaceOutlined />}>
          Wróć
        </Button>
        <Button variant="contained" size="large" onClick={handleNextStep} endIcon={<Check />}>
          Dalej
        </Button>
      </Stack>
    </>
  );
};
export default SongDependentsEditor;
