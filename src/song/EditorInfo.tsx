import { Verified } from '@mui/icons-material';
import {SxProps, Typography} from '@mui/material';
import { FC } from 'react';
import { IEditorInfo } from '../types/song.types.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import VerifiedUserTooltip from '../user/VerifiedUserTooltip.tsx';
import VerifiedUserIcon from '../components/icon/VerifiedUserIcon.tsx';

interface IEditorInfoProps {
  prefix: string;
  editorInfo: IEditorInfo;
  sx?: SxProps;
}

const EditorInfo: FC<IEditorInfoProps> = ({ prefix, editorInfo, sx }) => {
  const date = new Date(editorInfo.time * 1000);
  return (
    <Typography variant="caption" color="textSecondary" sx={sx}>
      {editorInfo.verified && (
        <BasicTooltip title="Zweryfikowano">
          <Verified color="success" sx={{ mr: '0.3em', verticalAlign: 'text-top' }} fontSize="inherit" />
        </BasicTooltip>
      )}
      {prefix}
      {!isNaN(date.valueOf()) && (
        <>
          {' '}
          <BasicTooltip title={date.toLocaleString()} span>
            <>{date.toLocaleDateString()}</>
          </BasicTooltip>
        </>
      )}
      {' przez '}
      <VerifiedUserTooltip userType={editorInfo.type}>
        <VerifiedUserIcon
          userType={editorInfo.type}
          color="success"
          fontSize="inherit"
          sx={{ marginRight: '0.3em', verticalAlign: 'text-top' }}
        />
      </VerifiedUserTooltip>
      {editorInfo.name ?? 'Nieznany użytkownik'}
    </Typography>
  );
};

export default EditorInfo;
