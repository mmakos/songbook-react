import { Verified } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { FC } from 'react';
import { IEditorInfo } from '../types/song.types.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import VerifiedUserTooltip from '../user/VerifiedUserTooltip.tsx';
import VerifiedUserIcon from '../components/icon/VerifiedUserIcon.tsx';

interface IEditorInfoProps {
  prefix: string;
  editorInfo: IEditorInfo;
}

const EditorInfo: FC<IEditorInfoProps> = ({ prefix, editorInfo }) => {
  const date = new Date(editorInfo.time * 1000);
  return (
    <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
      {editorInfo.verified && (
        <BasicTooltip title="Zweryfikowano">
          <Verified color="success" sx={{ mr: '0.3em' }} fontSize="inherit" />
        </BasicTooltip>
      )}
      {prefix}
      {!isNaN(date.valueOf()) && (
        <>
          &nbsp;
          <BasicTooltip title={date.toLocaleString()}>
            <>{date.toLocaleDateString()}</>
          </BasicTooltip>
        </>
      )}
      &nbsp;przez&nbsp;
      <VerifiedUserTooltip userType={editorInfo.type} style={{ marginRight: '0.3em' }}>
        <VerifiedUserIcon userType={editorInfo.type} color="success" fontSize="inherit" />
      </VerifiedUserTooltip>
      {editorInfo.name ?? 'Nieznany użytkownik'}
    </Typography>
  );
};

export default EditorInfo;
