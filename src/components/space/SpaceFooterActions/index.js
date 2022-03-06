import React, { useState } from "react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { Fab, Stack, styled, Tooltip } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
//import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
//import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
//import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import SettingsMenu from "../../shared/SettingsMenu";
import { color } from "../../../assets/colors";
import { useSelector } from "react-redux";
//import { localTrackMutedChanged } from "../../../store/actions/track";
import BasicDialogue from "../../shared/BasicDialogue";

const StyledFab = styled(Fab)(({ theme }) => ({
  width: "48px",
  height: "48px",
  lineHeight: "36px",
  marginRight: theme.spacing(1),
  boxShadow: 'none',
  "&>svg": {
    fontSize: "1.6rem",
    color: color.gray,
  },
}));
const SpaceFooterActions = ({dominantSpeakerId, setLocalHandRaise, muteAll, handleMuteAllClick}) => {
    //const [audioTrack] = useSelector(state => state.localTrack);
    //const remoteTracks = useSelector(state => state.remoteTrack);
    const [raiseHand, setRaiseHand] = useState(false);
    const conference = useSelector(state=>state.conference);
    const [inviteOpen, setInviteOpen] = useState(false);
    //const dispatch = useDispatch()
    //const profile = useSelector((state) => state.profile);
  

  const handleClickInviteOpen = () => {
    setInviteOpen(!inviteOpen);
  };

  const startRaiseHand = () => {
    conference.setLocalParticipantProperty("handraise", "start");
    setRaiseHand(true);
    setLocalHandRaise(true);
  };
  
  const stopRaiseHand = () => {
    conference.setLocalParticipantProperty("handraise", "stop");
    setRaiseHand(false);
    setLocalHandRaise(false);
  };
  
  // const handleMuteAllClick = async() => {
  //   for (let [key, value] of Object.entries(remoteTracks)) {
  //      await conference.muteParticipant(key, "audio") 
  //   }
  //   dispatch(remoteTrackMutedChanged());
  //   setMuteAll(true);
  // }

  // const muteAudio = async () => {
  //     await audioTrack?.mute();
  //     dispatch(localTrackMutedChanged());
  // };

  // const unmuteAudio = async () => {
  //     await audioTrack?.unmute();
  //     dispatch(localTrackMutedChanged());
  // };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Stack direction="row" justifyContent="center" sx={{ p: 1, mt: 2 }}>
      <Tooltip title={ raiseHand ? "Hand Down" : "Raise Hand"} placement="top" arrow>
        <StyledFab sx={raiseHand && {background: color.primary, '&:hover': {background: color.primary, opacity: '0.8'}}} onClick={raiseHand ? stopRaiseHand : startRaiseHand}>
          <PanToolOutlinedIcon />
        </StyledFab>
      </Tooltip>
      {/* {profile.subRole === "listener" ? (
      <Tooltip title="listeners are muted" placement="top" arrow>
        <StyledFab sx={{background: color.yellow}}>
                    <MicOffOutlinedIcon />
        </StyledFab>
      </Tooltip>)
      : (
        <Tooltip title={audioTrack?.isMuted() ? "Unmute Audio" : "Mute Audio"} placement="top" arrow>
        <StyledFab sx={audioTrack?.isMuted() && {background: color.yellow, '&:hover': {background: color.yellow, opacity: '0.8'}}} onClick={audioTrack?.isMuted() ?
                    unmuteAudio : muteAudio}>
        {audioTrack?.isMuted() ?
                    <MicOffOutlinedIcon /> : <MicNoneOutlinedIcon />}
        </StyledFab>
      </Tooltip>)} */}
      <Tooltip title="Manage Space" placement="top" arrow>
        <StyledFab onClick={handleClickInviteOpen}>
          <ManageAccountsIcon />
        </StyledFab>
      </Tooltip>
      {inviteOpen && <BasicDialogue open={inviteOpen} handleclose={handleClickInviteOpen} />}
      <Tooltip title="Mute All" placement="top" arrow>
        <StyledFab sx={muteAll && {background: color.primary, '&:hover': {background: color.primary, opacity: '0.8'}}} onClick={handleMuteAllClick}>
          <VolumeUpOutlinedIcon />
        </StyledFab>
      </Tooltip>
      <Tooltip title="Share" placement="top" arrow>
        <StyledFab sx={open && {background: color.primary, '&:hover': {background: color.primary, opacity: '0.8'}}} onClick={handleClick}>
          <ShareOutlinedIcon />
        </StyledFab>
      </Tooltip>
      <SettingsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} open={open} />
    </Stack>
  );
};

export default SpaceFooterActions;