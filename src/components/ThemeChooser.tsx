import { FC } from 'react';
import { PaletteMode, ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';
import { DarkModeOutlined, LightMode, SettingsBrightness } from '@mui/icons-material';

interface IThemeChooserProps {
  theme?: PaletteMode;
  changeTheme: (theme?: PaletteMode) => void;
  systemLabel?: string;
}

const ThemeChooser: FC<IThemeChooserProps & ToggleButtonGroupProps> = ({ theme, changeTheme, systemLabel, ...props }) => {
  const changeSongThemeMode = (value: string) => {
    let palette: PaletteMode | undefined;
    if (value === 'dark') palette = 'dark';
    if (value === 'light') palette = 'light';
    changeTheme(palette);
  };

  return (
    <ToggleButtonGroup
      {...props}
      exclusive
      value={theme ?? 'system'}
      onChange={(_, value) => changeSongThemeMode(value)}
    >
      <ToggleButton value="light">
        <LightMode sx={{ mr: '0.3em' }} />
        Jasny
      </ToggleButton>
      <ToggleButton value="system">
        <SettingsBrightness sx={{ mr: '0.3em' }} />
        {systemLabel ?? "Systemu"}
      </ToggleButton>
      <ToggleButton value="dark">
        <DarkModeOutlined sx={{ mr: '0.3em' }} />
        Ciemny
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ThemeChooser;
