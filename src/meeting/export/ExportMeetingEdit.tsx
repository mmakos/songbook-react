import ExportMeetingSettings from './ExportMeetingSettings.tsx';
import ExportMeetingSongs from './ExportMeetingSongs.tsx';
import Progress from '../../components/Progress.tsx';
import NotFound from '../../subsites/NotFound.tsx';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { useOptionalExportMeetingContext } from './ExportMeetingContext.tsx';
import BasicHelmet from '../../subsites/BasicHelmet.tsx';

const ExportMeetingEdit = () => {
  const { meeting, setStage } = useOptionalExportMeetingContext();

  if (meeting === undefined) return <Progress />;
  if (meeting === null) return <NotFound text="Spotkanie nie istnieje" />;

  return (
    <Stack spacing={2} width="100%">
      <BasicHelmet title={`Tworzenie śpiewnika „${meeting.name}”`} />
      <Button onClick={() => setStage('export')}>Eksportuj</Button>
      <Divider>
        <Typography variant="h5">Ustawienia śpiewnika</Typography>
      </Divider>
      <ExportMeetingSettings />
      <Divider>
        <Typography variant="h5">Piosenki</Typography>
      </Divider>
      <ExportMeetingSongs />
    </Stack>
  );
};

export default ExportMeetingEdit;
