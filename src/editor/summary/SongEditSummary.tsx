import { useSongEditContext } from '../SongEditContext.tsx';
import Song from '../../song/Song.tsx';
import { Button } from '@mui/material';
import { BackspaceOutlined, DataObject } from '@mui/icons-material';
import pako from 'pako';

const SongEditSummary = () => {
  const { song, updateStep } = useSongEditContext();

  const exportJSON = () => {
    const jsonString = JSON.stringify(song);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  };

  const exportTargetFormat = () => {
    const json = JSON.stringify(song?.verses);
    const compressed = pako.gzip(json);
    const base64 = compressed.reduce<string>((str, byte) => str + String.fromCharCode(byte), '');
    const jsonString = JSON.stringify({ ...song, verses: btoa(base64) });

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1em' }}>
        <Button variant="outlined" size="large" onClick={() => updateStep(-1)} startIcon={<BackspaceOutlined />}>
          Wróć
        </Button>
        <Button variant="contained" size="large" onClick={exportTargetFormat} endIcon={<DataObject />}>
          Eksportuj (spakowane)
        </Button>
        <Button variant="contained" size="large" onClick={exportJSON} endIcon={<DataObject />}>
          Eksportuj
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Song song={song} />
      </div>
    </>
  );
};

export default SongEditSummary;
