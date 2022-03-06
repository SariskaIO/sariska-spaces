import Box from '@mui/material/Box';
import React from 'react';
import {styled} from '@mui/material/styles';
import { Stack, Fab, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { color } from '../../../assets/colors';

const StyledBox = styled(Box)(()=>({
    display: 'flex',
    justifyContent: 'end',
}))

const StyledFab = styled(Fab)(()=>({
    height:'28px',
    width: '28px',
    lineHeight: '10px',
    minHeight: '25px',
    color: color.red,
    marginRight: '-5px',
    marginTop: '10px',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    border: `1px solid ${color.red}`,
    "&:hover": {
        background: 'transparent',
        opacity: 0.7,
        "&>svg": {
            color: color.red
        }
    },
    "&>svg":{
        fontSize: '1.2rem',
    }
}))

const CloseOnlyDialogueHeader = ({handleLeave, closeTitle}) => {
    return (
        <StyledBox>
            <Stack direction="row" alignItems="center" sx={{mt: 1}}>
                <Tooltip title={closeTitle} placement="top" arrow>
                    <StyledFab aria-label="add" onClick={handleLeave}>
                        <CloseIcon sx={{zIndex: '9999'}} onClick={handleLeave}/>
                    </StyledFab>
                </Tooltip>
            </Stack>
        </StyledBox>
    )
}

export default CloseOnlyDialogueHeader
