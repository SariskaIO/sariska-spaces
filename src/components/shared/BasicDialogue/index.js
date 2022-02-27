import * as React from 'react';

import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import { color } from '../../../assets/colors';
import InviteMembers from '../../../views/InviteMembers';

const StyledBox = styled(Box)(({theme})=>({
    minHeight: '455px',
    minWidth: '360px',
    width: '365px',
    background: color.body,
    borderRadius: '40px',
    padding: theme.spacing(0.5, 2.5, 2, 2.5),
    position: 'absolute',
    bottom: theme.spacing(15),
    right: '-1px',
    top: '-1px',
    color: color.gray,
    border: `1px solid ${color.border}`,
    zIndex: 9999
}))

export default function BasicDialogue({children, handleclose}) {

  return (
        <StyledBox >
            <InviteMembers handleClose={handleclose} />
        </StyledBox>
  );
}
