import Box from '@mui/material/Box';
import React from 'react';
import {styled} from '@mui/material/styles';
import { Tooltip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { color } from '../../../assets/colors';

const StyledBox = styled(Box)(()=>({
    display: 'flex',
    justifyContent: 'end'
}))

const StyledFab = styled(Button)(()=>({
    height:'28px',
    width: '28px',
    lineHeight: '10px',
    minHeight: '25px',
    color: color.gray,
    marginRight: '-15px',
    marginTop: '8px',
    "&:hover": {
        opacity: 0.7,
        "&>svg": {
            color: color.red
        }
    },
    "&>svg":{
        fontSize: '1.2rem',
    }
}))

const GoBack = ({handleLeave, title}) => {
    return (
        <StyledBox>
                <Tooltip title={title} placement="top" arrow>
                    <StyledFab aria-label="leave" onClick={handleLeave} >
                        <ArrowBackIcon sx={{zIndex: 1}} />
                    </StyledFab>
                </Tooltip>
        </StyledBox>
    )
}

export default GoBack
