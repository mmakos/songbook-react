import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { ITextSettings } from '../../store/songbook.reducer.ts';
import { FC } from 'react';

interface ITextSettingsProps {
  textSettings: ITextSettings;
  setTextSettings: (textSettings: ITextSettings) => void;
}

const TextSettings: FC<ITextSettingsProps> = ({ textSettings, setTextSettings }) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={textSettings.capitalize}
            onChange={(_, checked) => setTextSettings({ ...textSettings, capitalize: checked })}
          />
        }
        label="Początki wersów zawsze z wielkiej litery"
      />
      <FormControlLabel
        control={
          <Switch
            checked={textSettings.hideNonLiteral}
            onChange={(_, checked) => setTextSettings({ ...textSettings, hideNonLiteral: checked })}
          />
        }
        label="Nie wyświetlaj znaków interpunkcyjnych"
      />
      <FormControlLabel
        control={
          <Switch
            checked={textSettings.hideNonLiteralPrefix}
            onChange={(_, checked) => setTextSettings({ ...textSettings, hideNonLiteralPrefix: checked })}
          />
        }
        disabled={textSettings.hideNonLiteral}
        label="na początkach linii"
        sx={{ ml: '1em' }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={textSettings.hideNonLiteralSuffix}
            onChange={(_, checked) => setTextSettings({ ...textSettings, hideNonLiteralSuffix: checked })}
          />
        }
        disabled={textSettings.hideNonLiteral}
        label="na końcach linii"
        sx={{ ml: '1em' }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={textSettings.numberVerses}
            onChange={(_, checked) => setTextSettings({ ...textSettings, numberVerses: checked })}
          />
        }
        label="Wyświetlaj numery zwrotek"
      />
    </FormGroup>
  );
};

export default TextSettings;
