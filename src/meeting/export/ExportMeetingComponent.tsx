import { Stack } from '@mui/material';
import { useOptionalExportMeetingContext } from './ExportMeetingContext.tsx';
import ExportMeetingEdit from './ExportMeetingEdit.tsx';
import MeetingExporter from './MeetingExporter.tsx';

const ExportMeetingComponent = () => {
  const { stage } = useOptionalExportMeetingContext();

  return (
    <Stack spacing={2} width="100%">
      {stage === 'edit' ? <ExportMeetingEdit /> : <MeetingExporter />}
    </Stack>
  );
};

export default ExportMeetingComponent;
