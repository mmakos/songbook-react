import { Checkbox, FormControlLabel, List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { useExportMeetingContext } from './ExportMeetingContext.tsx';

type TAuthorType = 'lyrics' | 'composer' | 'translation' | 'performer' | 'source' | 'band' | 'bible';

export interface IAuthorsSettings {
  show: boolean;
  excluded: TAuthorType[];
  inline: boolean;
}

export const defaultAuthorsSettings = {
  show: true,
  excluded: [],
  inline: false,
};

const authorDisplayNames: Record<TAuthorType, string> = {
  lyrics: 'Słowa',
  composer: 'Muzyka',
  translation: 'Tłumaczenie',
  performer: 'Wykonawca',
  source: 'Źródło',
  band: 'Zespół',
  bible: 'Cytat biblijny',
};

const ExportAuthorsSettings = () => {
  const { authorsSettings, setAuthorsSettings } = useExportMeetingContext();

  const handleToggleAuthor = (author: TAuthorType) => {
    setAuthorsSettings({
      ...authorsSettings,
      excluded: authorsSettings.excluded.includes(author)
        ? authorsSettings.excluded.filter((a) => a !== author)
        : [...authorsSettings.excluded, author],
    });
  };

  return (
    <Stack>
      <FormControlLabel
        control={
          <Checkbox
            checked={authorsSettings.show}
            onChange={(_, show) => setAuthorsSettings({ ...authorsSettings, show })}
          />
        }
        label="Wyświetlaj autorów"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={authorsSettings.inline}
            onChange={(_, inline) => setAuthorsSettings({ ...authorsSettings, inline })}
          />
        }
        label="Wyświetlaj w jednej linii"
      />
      <List dense>
        {Object.entries(authorDisplayNames).map(([author, displayName]) => (
          <ListItemButton key={author} onClick={() => handleToggleAuthor(author as TAuthorType)}>
            <ListItemIcon>
              <Checkbox checked={!authorsSettings.excluded.includes(author as TAuthorType)} disableRipple />
            </ListItemIcon>
            <ListItemText>{displayName}</ListItemText>
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
};

export default ExportAuthorsSettings;
