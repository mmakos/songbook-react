import { ExportMeetingContextProvider } from './ExportMeetingContext.tsx';
import ExportMeetingComponent from './ExportMeetingComponent.tsx';
import BasicHelmet from '../../subsites/BasicHelmet.tsx';

const ExportMeeting = () => {
  return (
    <ExportMeetingContextProvider>
      <BasicHelmet title="Tworzenie śpiewnika" />
      <ExportMeetingComponent />
    </ExportMeetingContextProvider>
  );
};

export default ExportMeeting;
