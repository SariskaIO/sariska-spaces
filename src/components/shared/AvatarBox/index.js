import React from 'react';
import { Avatar, Box, Stack, styled, Typography} from '@mui/material'
import { color } from '../../../assets/colors';
import img from '../../../assets/images/voice.gif';
import { useDispatch, useSelector } from 'react-redux';
import Audio from '../Audio';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';

const AvatarBoxContainer = styled(Box)(({theme})=>({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '33%',
    marginBottom: theme.spacing(2),
    margin: 'auto', 
    height: 'fit-content'
}))
const HandRaiseBox = styled(Box)(({theme})=>({
    zIndex: 1,
    marginRight: '-16px'
}))
const HandRaise = styled(Box)(({theme})=>({
    "& svg":{
        fontSize: '1rem',
        borderRadius: '50%',
        background: color.yellow,
        padding: '2px'
    }
}))
const AvatarCircle = styled(Avatar)(({theme})=>({
    width: '30px',
    height: '30px',
    fontSize: '0.7rem'
}))
const Name = styled(Typography)(({theme})=>({
    fontWeight: 600,
    fontSize: '0.7rem',
    marginTop: '12px',
    textTransform: 'capitalize'
}))
const Role = styled(Typography)(({theme})=>({
    textTransform: 'capitalize'
}))
const ImgContainer = styled(Box)(({theme})=>({
    display: 'flex',
    alignItems: 'center',
    background: color.gray,
    width: '100%',
    borderRadius: '15px',
    color: color.white,
    marginBottom: theme.spacing(1),
    "&>p":{
        fontSize: '0.6rem',
    },
    "&>img": {
        width: '20px'
    }
}))

const AvatartBox = ({
    role,
    isActiveSpeaker,
    participantDetails,
    participantTracks,
    localUserId,
    onClick
}) => {

    const audioTrack = participantTracks.find(track => track.isAudioTrack());
    const avatarColors = useSelector(state => state.color);
    const { pinnedPartcipantId, raisedHandParticipantIds } = useSelector(state => state.layout);
    const dispatch = useDispatch();
    let avatarColor = avatarColors[participantDetails?.id];

    return (
        <AvatarBoxContainer onClick={onClick}>
            <Box>
                {!audioTrack?.isLocal() && <Audio track={audioTrack}/>}
            </Box>
                    <AvatarCircle
                        src={participantDetails?.avatar ? participantDetails?.avatar: null }
                        sx={{bgColor: avatarColor}}>{participantDetails?.name.slice(0, 1).toUpperCase()}
                    </AvatarCircle>
                    <HandRaiseBox sx={raisedHandParticipantIds[participantDetails?.id] ? {marginTop: '-37px'} : {marginTop: '-12px'}}>
                    {raisedHandParticipantIds[participantDetails?.id] &&
                        <HandRaise ><PanToolOutlinedIcon /></HandRaise>
                    }
                    </HandRaiseBox>
                    <Name>{localUserId === participantDetails?.id ? "You" : participantDetails?.name}</Name>
                    <Stack direction="row" alignItems="center">
                        <ImgContainer style={(role ==="Speaker" || role ==="Host") ? {padding: '2px 12px 2px 4px' }: {padding:'2px 12px 2px 12px'}}>
                        {(role ==="Speaker" || role ==="Host") && <img src={img} alt="host" height="15px" width= '100%'/>}
                        <Role>{role}</Role>
                        </ImgContainer>
                    </Stack>
                </AvatarBoxContainer>
    )
}

export default AvatartBox
