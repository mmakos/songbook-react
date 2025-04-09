import KeyChooser from '../../circle-of-fifths/KeyChooser.tsx';
import Grid from '@mui/material/Grid2';
import { useSongEditContext } from '../SongEditContext.tsx';
import { IKey, ISongKey } from '../../types/song.types.ts';

const SongKeysChooser = () => {
  const { songEdit, setSongEdit } = useSongEditContext();

  const changeKey = (name: string) => (key?: IKey) => {
    const editKey: ISongKey = songEdit.key ?? ({} as ISongKey);
    setSongEdit({ ...songEdit, key: { ...editKey, [name]: key } });
  };

  return (
    <div>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KeyChooser
            fullWidth
            label="Tonacja w śpiewniku"
            helperText="W jakiej tonacji wpisałeś akordy"
            required
            chosenKey={songEdit.key?.songbook}
            setChosenKey={changeKey("songbook")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KeyChooser
            fullWidth
            label="Tonacja oryginalna"
            helperText="Najlepiej z nagrania, które załączyłeś"
            chosenKey={songEdit.key?.original}
            setChosenKey={changeKey("original")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KeyChooser
            fullWidth
            label={songEdit.key?.maxComfort ? 'Minimalna tonacja' : 'Tonacja komfortowa'}
            helperText={`${songEdit.key?.maxComfort ? 'Minimalna p' : 'P'}roponowana przez ciebie tonacja`}
            chosenKey={songEdit.key?.comfort}
            setChosenKey={changeKey("comfort")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KeyChooser
            fullWidth
            label="Maksymalna tonacja"
            helperText="Maksymalna proponowana przez ciebie tonacja"
            chosenKey={songEdit.key?.maxComfort}
            setChosenKey={changeKey("maxComfort")}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default SongKeysChooser;
