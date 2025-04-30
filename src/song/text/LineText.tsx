import { CSSProperties, FC } from 'react';
import { ILine, ITextRun } from '../../types/song.types.ts';
import EmptyLine from './EmptyLine.tsx';
import { useAppSelector } from '../../store/songbook.store.ts';
import { IFontStyle } from '../../components/font/FontStyle.tsx';
import { Chat } from '@mui/icons-material';
import { Stack, styled } from '@mui/material';
import BasicTooltip from '../../components/BasicTooltip.tsx';
import { IFontStyles, ITextSettings } from '../../store/songbook.reducer.ts';

interface ILineTextProps {
  line: ILine;
  reference?: boolean;
  verseNumber?: number;
}

const StyledChatIcon = styled(Chat)(({ theme }) => ({
  alignSelf: 'center',
  cursor: 'pointer',
  marginLeft: '0.5em',
  transition: theme.transitions.create('color', { duration: theme.transitions.duration.shortest }),
  ['&:hover']: {
    color: theme.palette.text.primary,
  },
}));

const StyledTextSpan = styled('span')({
  whiteSpace: 'pre',
});

const capitalizeLine = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const processText = (text: string, first: boolean, last: boolean, textSettings: ITextSettings, reference?: boolean) => {
  let processed = text;
  if (textSettings.hideNonLiteral) {
    processed = processed.replace(/[^\p{L}\p{N}\s']+/gu, '');
  } else {
    if (first && textSettings.hideNonLiteralPrefix) {
      processed = processed.replace(/^[^\p{L}\p{N}\s]+/u, '');
    }
    if (last && textSettings.hideNonLiteralSuffix) {
      processed = processed.replace(/[^\p{L}\p{N}\s]+$/u, '');
    }
  }
  if (first) processed = processed.trimStart();
  if (last) processed = processed.trimEnd();
  if (last && reference && (textSettings.hideNonLiteral || textSettings.hideNonLiteralSuffix)) {
    processed += '…';
  }
  if (processed.length && capitalizeLine(processed)) {
    processed = processed.charAt(0).toUpperCase() + processed.slice(1);
  }
  return processed;
};

const getRunStyle = (run: ITextRun, fontStyles: IFontStyles): CSSProperties | undefined => {
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

const LineText: FC<ILineTextProps> = ({ line, reference, verseNumber }) => {
  const textSettings = useAppSelector((state) => state.songbookSettings.textSettings);
  const fontStyles = useAppSelector((state) => state.songbookSettings.songTheme.fontStyles);

  return (
    <Stack direction="row">
      {verseNumber && textSettings.numberVerses && <>{verseNumber}.&nbsp;</>}
      {line.text?.map((run, i) => {
        return (
          <StyledTextSpan key={'r' + i} style={{ ...getRunStyle(run, fontStyles) }}>
            {processText(run.text, i == 0, i == line.text!.length - 1, textSettings, reference)}
          </StyledTextSpan>
        );
      })}
      {!line.text && <EmptyLine />}

      {line.comment && (
        <BasicTooltip title={line.comment}>
          <StyledChatIcon fontSize="inherit" color="disabled" />
        </BasicTooltip>
      )}
    </Stack>
  );
};

export default LineText;
