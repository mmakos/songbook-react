import ExportMeetingSong from './ExportMeetingSong.tsx';
import { useState } from 'react';
import { useExportMeetingContext } from './ExportMeetingContext.tsx';

const ExportMeetingSongs = () => {
  const { meeting } = useExportMeetingContext();
  const [expandedSong, setExpandedSong] = useState<string>();

  return (
    <div>
      {meeting.songs.map((s) => (
        <ExportMeetingSong
          key={s.slug}
          song={s}
          expanded={expandedSong === s.slug}
          setExpanded={(expand) => setExpandedSong(expand ? s.slug : undefined)}
        />
      ))}
    </div>
  );
};

export default ExportMeetingSongs;
