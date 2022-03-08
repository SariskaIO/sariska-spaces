import { Box } from '@mui/system'
import React from 'react';
import {styled} from '@mui/material/styles';
import { Avatar, AvatarGroup, Fab, Stack, Typography } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { color } from '../../../assets/colors';
import { useSelector } from 'react-redux';

const JoinBox = styled(Box)(({theme})=>({
    background: '#fdfdfd',
    margin: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    border: '1px solid #e8e8e3',
    width: '420px'
}))
const Heading = styled(Typography)(({theme})=>({
    fontWeight: 600,
    marginRight: theme.spacing(0.5)
}))
const Dot = styled(Typography)(({theme})=>({
    fontSize: '2rem',
    marginTop: '4px',
    lineHeight: '0px'
}))
const Name = styled(Typography)(({theme})=>({
    fontWeight: 100,
    marginLeft: theme.spacing(0.5)
}))
const Title = styled(Typography)(({theme})=>({
    fontWeight: 600,
    fontSize: '1.1rem'
}))

const StyledFab = styled(Fab)(({theme})=>({
    textTransform: 'capitalize', 
    marginBottom: theme.spacing(1), 
    border: `2px solid ${color.border}`, 
    background: '#f6f3e6', 
    color: '#212121c4', 
    fontWeight: '600',
    padding: '8px',
    minWidth: '150px',
    width: '100%',
    marginTop: theme.spacing(3)
    //color: 'rgba(80,79,75,1)'
}))

const JoinSpace = ({open, handleLeave, handleJoinSpace}) => {
    const spaceTitle = useSelector(state=>state.profile?.spaceTitle);

    return (
        <JoinBox>
            <Box sx={{minWidth: '360px'}}>
                <Stack direction="row" justifyContent="space-between">
                <Stack direction="column">
                <Stack direction="row">
                    <Heading >Live </Heading> 
                    <Dot> . </Dot>
                    <Name >Gurudeep</Name> 
                </Stack>
                <Title >{spaceTitle}</Title> 
                </Stack>
                    <Box>
                        <AvatarGroup max={4}>
                            <Avatar alt="Remy Sharp" sx={{ bgcolor: deepOrange[500] }}>G</Avatar>
                            <Avatar alt="Travis Howard" sx={{ bgcolor: deepPurple[500] }}>B</Avatar>
                            <Avatar alt="Cindy Baker">A</Avatar>
                            <Avatar alt="Agnes Walker" sx={{ bgcolor: deepOrange[500] }}>B</Avatar>
                        </AvatarGroup> 
                    </Box>
                </Stack>
                <StyledFab variant="extended" size="small" aria-label="add" onClick={open ? handleLeave : handleJoinSpace}>
                  {open ? 'End Stage' : 'Join the Stage'}
                </StyledFab>
            </Box>
        </JoinBox>
            
    )
}

export default JoinSpace
