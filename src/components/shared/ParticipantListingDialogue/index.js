import * as React from 'react';

import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import { color } from '../../../assets/colors';
import InviteMembers from '../../../views/InviteMembers';
import ParticipantTypeList from '../ParticipantTypeList';

const StyledBox = styled(Box)(({theme})=>({
    minHeight: '455px',
    minWidth: '360px',
    width: '365px',
    background: color.body,
    borderRadius: '40px',
    padding: theme.spacing(0.5, 2.5, 2, 2.5),
    position: 'absolute',
    bottom: theme.spacing(15),
    right: 0,
    top: 0,
    color: color.gray,
    border: `1px solid ${color.border}`,
    zIndex: 9999,
    overflow: 'auto'
}))

export default function ParticipantListingDialogue({children, handleClose}) {

  return (
            <ParticipantTypeList handleClose={handleClose} />
  );
}
