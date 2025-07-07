import { useExportMeetingContext } from './ExportMeetingContext.tsx';
import { useRef } from 'react';
import { convertToDocx } from './docx.converter.ts';
import { Packer } from 'docx';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import { Download } from '@mui/icons-material';

const MeetingDownloader = () => {
  const context = useExportMeetingContext();
  const { convertedSongs, meeting } = context;
  const blob = useRef<Blob>();

  const generateDocx = async (): Promise<Blob> => {
    blob.current ??= await Packer.toBlob(
      convertToDocx(
        meeting.songs.map((s) => convertedSongs[s.slug]),
        context
      )
    );
    return blob.current;
  };

  const downloadDocx = async () => {
    saveAs(await generateDocx(), `${meeting.name}.docx`);
  };

  return (
    <div style={{ alignSelf: 'center' }}>
      <Button onClick={downloadDocx} variant="contained" endIcon={<Download />}>
        Pobierz
      </Button>
    </div>
  );
};

export default MeetingDownloader;
