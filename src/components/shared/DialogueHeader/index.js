import Box from '@mui/material/Box';
import React from 'react';
import {styled} from '@mui/material/styles';
import { Stack, Button, Fab, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { color } from '../../../assets/colors';
import {useHistory} from 'react-router-dom';
import { clearAllReducers } from '../../../store/actions/conference';
import { useDispatch, useSelector } from 'react-redux';

const StyledBox = styled(Box)(()=>({
    display: 'flex',
    justifyContent: 'end',
    marginTop: '10px'
}))
const IconButton = styled(Fab)(({theme})=>({
    height:'28px',
    width: '28px',
    lineHeight: '10px',
    minHeight: '25px',
    color: color.gray,
    marginRight: theme.spacing(1),
}))
const StyledFab = styled(Fab)(()=>({
    height:'28px',
    width: '28px',
    lineHeight: '10px',
    minHeight: '25px',
    color: color.red,
    marginRight: '5px',
    marginTop: '7px',
    boxShadow: 'none',
    background: 'none',
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

const DialogueHeader = ({handleLeave, handleMinimize, closeTitle}) => {
    const history=useHistory();
    const dispatch = useDispatch();
    const spaceTitle  = useSelector(state=>state.profile?.spaceTitle);
    
    const leaveConference = () => {
        history.push(`/leave/${spaceTitle}`);
        dispatch(clearAllReducers());
    };
    return (
        <StyledBox>
            <Stack direction="row" alignItems="center" sx={{mt: 1}}>
                {/* <Tooltip title="Minimize" placement="top" arrow>
                    <IconButton onClick={handleMinimize}>
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </Tooltip> */}
                <Tooltip title={closeTitle} placement="top" arrow>
                    <StyledFab aria-label="add" onClick={handleLeave}>
                        <CloseIcon sx={{zIndex: '9999'}} onClick={leaveConference}/>
                    </StyledFab>
                </Tooltip>
            </Stack>
        </StyledBox>
    )
}

export default DialogueHeader
