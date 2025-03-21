import { FC } from 'react';

interface ShortcutProps {
  baseKey: string;
  mod?: boolean;
  shift?: boolean;
}

const isMac = navigator.platform.indexOf('Mac') > -1;

const Shortcut: FC<ShortcutProps> = ({ baseKey, mod, shift }) => {
  return (
    <>
      {shift && (
        <>
          <kbd>Shift</kbd>+
        </>
      )}
      {mod && (
        <>
          <kbd>{isMac ? 'Cmd' : 'Ctrl'}</kbd>+
        </>
      )}
      <kbd>{baseKey}</kbd>
    </>
  );
};

export default Shortcut;