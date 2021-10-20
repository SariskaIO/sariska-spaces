import { Fab, Stack, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect} from "react";
import { styled } from "@mui/material/styles";
import img from "../../../assets/images/voice.gif";
import { color } from "../../../assets/colors";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {useHistory} from 'react-router-dom';
import { USER_ROLE } from "../../../constants";
import { clearAllReducers } from "../../../store/actions/conference";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import { localTrackMutedChanged } from "../../../store/actions/track";
import Audio from  "../../shared/Audio";

const StyledBox = styled(Box)(({ theme }) => ({
  background: color.gray,
  border: `2px solid ${color.yellow}`,
  minWidth: "390px",
  borderRadius: "20px",
  padding: "10px 20px 20px 0px",
  boxSizing: "border-box",
  position: "absolute",
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  width: "400px",
  zIndex: 1,
  "&:hover": {
    cursor: "pointer",
  },
}));
const Name = styled(Typography)(({ theme }) => ({
  color: color.yellow,
}));
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.1rem",
  color: color.white,
  paddingLeft: "20px",
  width: "320px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textTransform: 'capitalize'
}));
const StyledFab = styled(Fab)(() => ({
  position: 'absolute',
  bottom: '75px',
  right: '30px',
  height: "28px",
  width: "28px",
  lineHeight: "28px",
  minHeight: "28px",
  background: "none",
  color: color.white,
  marginRight: "-15px",
  marginTop: "-20px",
  boxShadow: "none",
  zIndex: "999",
  "&:hover": {
    background: "transparent",
    opacity: 0.7,
    "&>svg": {
      color: color.red,
    },
  },
  "&>svg": {
    fontSize: "1.2rem",
  },
}));
const StyledAudioFab = styled(Fab)(() => ({
  position: 'absolute',
  bottom: '15px',
  right: '30px',
  height: "28px",
  width: "28px",
  lineHeight: "28px",
  minHeight: "28px",
  background: "none",
  color: color.white,
  marginRight: "-15px",
  marginTop: "-20px",
  boxShadow: "none",
  zIndex: "999",
  "&:hover": {
    background: "transparent",
    opacity: 0.7,
    "&>svg": {
      color: color.red,
    },
  },
  "&>svg": {
    fontSize: "1.2rem",
  },
}));
const StyledCaption = styled(Typography)(() => ({
  fontSize: "0.6rem",
}));
const ParticipantsSummary = ({ handleDialogue, handleLeave, handleMinimize }) => {
  const profile = useSelector(state=>state.profile);
  const history = useHistory();
  const participants = useSelector(state=>state.participant);
  const hosts = participants.filter(item=>item._properties?.subRole === USER_ROLE.HOST);
  const others = participants.filter(item=>item._properties?.subRole !== USER_ROLE.HOST);
  const [audioTrack] = useSelector(state => state.localTrack);
  const remoteTracks = useSelector(state=>state.remoteTrack);
  const dispatch = useDispatch();
  
  const muteAudio = async () => {
    await audioTrack?.mute();
    dispatch(localTrackMutedChanged());
};

const unmuteAudio = async () => {
    await audioTrack?.unmute();
    dispatch(localTrackMutedChanged());
};

  const leaveConference = () => {
    history.push("/leave");
    dispatch(clearAllReducers());
  };
  console.log('hostss', hosts)
  return (
    <>
      <StyledBox onClick={handleMinimize}>
        <Stack direction="row">
          <Stack sx={{ width: "100%" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: "90%" }}
              >
                <Stack direction="row" alignItems="center">
                  <img height="40" src={img} alt="voice" />
                    {
                      hosts.map((participant, index)=>{
                        return (
                         <Name>
                            { participant?._identity?.user?.name }  {" "}
                            <StyledCaption variant="caption">(Host)</StyledCaption> 
                          </Name>
                      )})
                    }
                </Stack>
                { others.length > 0 ? <Name>+ {others.length} others</Name>: <Name>No one else is here</Name> }
              </Stack>
            </Stack>
            <Title>{profile.spaceTitle}</Title>
            
          </Stack>
        </Stack>
      </StyledBox>
      <StyledFab
        aria-label="leave"
        onClick={leaveConference}
        sx={{ zIndex: "9999" }}
      >
        <CloseIcon />
      </StyledFab>
      {profile.subRole === "listener" ? (
      <Tooltip title="listeners are muted" placement="top" arrow>
        <StyledAudioFab sx={{zIndex: "9999"}}>
                    <MicOffOutlinedIcon />
        </StyledAudioFab>
      </Tooltip>)
      : (
        <Tooltip title={audioTrack?.isMuted() ? "Unmute Audio" : "Mute Audio"} placement="top" arrow>
        <StyledAudioFab sx={audioTrack?.isMuted() && {background: color.yellow, '&:hover': {background: color.yellow, opacity: '0.8'}}} onClick={audioTrack?.isMuted() ?
                    unmuteAudio : muteAudio}>
        {audioTrack?.isMuted() ?
                    <MicOffOutlinedIcon /> : <MicNoneOutlinedIcon />}
        </StyledAudioFab>
      </Tooltip>)}
      {Object.entries(remoteTracks).map(([key, value]) => <Audio track={value?.find(track => track.isAudioTrack())} />)}          
    </>
  );
};   

export default ParticipantsSummary;
