import Box from '@mui/material/Box';
import React from 'react';
import {styled} from '@mui/material/styles';
import { color } from '../../../assets/colors';

const StyledBox = styled(Box)(({theme})=>({
    minHeight: '450px',
    minWidth: '360px',
    width: '365px',
    background: color.body,
    borderRadius: '40px',
    padding: theme.spacing(0.5, 2.5, 2, 2.5),
    position: 'absolute',
    bottom: theme.spacing(15),
    right: theme.spacing(1),
    top: theme.spacing(13),
    color: color.gray,
    border: `1px solid ${color.border}`,
    overflow: 'auto'
}))

const ContentBox = ({children}) => {
    return (
        <StyledBox>
            {children}
        </StyledBox>
    )
}

export default ContentBox;
