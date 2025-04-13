import { CSSProperties, FC } from 'react';
import { ILine, ITextRun } from '../../types/song.types.ts';
import EmptyLine from './EmptyLine.tsx';
import { useAppSelector } from '../../store/songbook.store.ts';
import { IFontStyle } from '../../components/font/FontStyle.tsx';
import { Chat } from '@mui/icons-material';
import { Stack } from '@mui/material';
import BasicTooltip from '../../components/BasicTooltip.tsx';

interface ILineTextProps {
  line: ILine;
}

const LineText: FC<ILineTextProps> = ({ line }) => {
  const fontStyles = useAppSelector((state) => state.songbookSettings.songTheme.fontStyles);

  const getRunStyle = (run: ITextRun): CSSProperties | undefined => {
    if (!run.style) return;
    let fontStyle: IFontStyle | undefined = undefined;
    switch (run.style) {
      case 1:
        fontStyle = fontStyles.text1;
        break;
      case 2:
        fontStyle = fontStyles.text2;
        break;
      case 3:
        fontStyle = fontStyles.text3;
        break;
    }
    if (!fontStyle) return;

    const style: CSSProperties = {};
    if (fontStyle.bold) style.fontWeight = 'bold';
    if (fontStyle.italic) style.fontStyle = 'italic';
    if (fontStyle.underline) style.textDecoration = 'underline';

    return style;
  };

  return (
    <Stack direction="row" spacing={1}>
      {line.text?.map((run, i) => (
        <span key={'r' + i} style={getRunStyle(run)}>
          {run.text}
        </span>
      ))}
      {!line.text && <EmptyLine />}

      {line.comment && (
        <BasicTooltip title={line.comment}>
          <Chat fontSize="inherit" color="disabled" sx={{ alignSelf: 'center', cursor: 'pointer' }} />
        </BasicTooltip>
      )}
    </Stack>
  );
};

export default LineText;
