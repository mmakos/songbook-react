import { Stack } from '@mui/material';
import { useOptionalExportMeetingContext } from './ExportMeetingContext.tsx';
import ExportMeetingEdit from './ExportMeetingEdit.tsx';
import MeetingExporter from './MeetingExporter.tsx';

const ExportMeetingComponent = () => {
  const { stage, meeting } = useOptionalExportMeetingContext();

  return (
    <Stack spacing={2} width="100%">
      {stage === 'download' && meeting ? <MeetingExporter /> : <ExportMeetingEdit />}
    </Stack>
  );
};

export default ExportMeetingComponent;
