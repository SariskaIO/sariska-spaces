import React, { useState } from "react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { Fab, Stack, styled, Tooltip } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import SettingsMenu from "../../shared/SettingsMenu";
import { color } from "../../../assets/colors";
import { useDispatch, useSelector } from "react-redux";
import { localTrackMutedChanged } from "../../../store/actions/track";
import { useHistory, useParams } from 'react-router-dom';

const StyledFab = styled(Fab)(({ theme }) => ({
  width: "48px",
  height: "48px",
  lineHeight: "36px",
  marginRight: theme.spacing(1),
  "&>svg": {
    fontSize: "1.6rem",
    color: color.gray,
  },
}));
const SpaceFooterActions = () => {
    const [mute, setMute] = useState(false);
    const [muteAll, setMuteAll] = useState(false);
    const [audioTrack] = useSelector(state => state.localTrack);
    const [raiseHand, setRaiseHand] = useState(false);
    const conference = useSelector(state=>state.conference);
    const dispatch = useDispatch()
    const queryParams = useParams()
  // const [open, setOpen] = useState(false);

  // const handleOpen = (e) => {
  //     e.preventDefault();
  //     setOpen(!open);
  // }
  const startRaiseHand = () => {
    conference.setLocalParticipantProperty("handraise", "start");
    setRaiseHand(true);
};
const stopRaiseHand = () => {
    conference.setLocalParticipantProperty("handraise", "stop");
    setRaiseHand(false);
};
  const handleMuteClick = () => {
    setMute(!mute)
  };
  const handleMuteAllClick = () => {
    setMuteAll(!muteAll);
  }

  const muteAudio = async () => {
    await audioTrack.mute();
    dispatch(localTrackMutedChanged());
};

const unmuteAudio = async () => {
    await audioTrack.unmute();
    dispatch(localTrackMutedChanged());
};

const handleManageSpace = () => {
  history.push(`/invite/${queryParams.spaceId}`);
}

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Stack direction="row" justifyContent="end" sx={{ p: 1, mt: 2 }}>
      <Tooltip title={ raiseHand ? "Hand Down" : "Raise Hand"} placement="top" arrow>
        <StyledFab sx={raiseHand && {background: color.yellow, '&:hover': {background: color.yellow, opacity: '0.8'}}} onClick={raiseHand ? stopRaiseHand : startRaiseHand}>
          <PanToolOutlinedIcon />
        </StyledFab>
      </Tooltip>
      <Tooltip title={audioTrack?.isMuted() ? "Unmute Audio" : "Mute Audio"} placement="top" arrow>
        <StyledFab sx={audioTrack?.isMuted() && {background: color.yellow, '&:hover': {background: color.yellow, opacity: '0.8'}}} onClick={audioTrack?.isMuted() ?
                    unmuteAudio : muteAudio}>
        {audioTrack?.isMuted() ?
                    <MicOffOutlinedIcon /> : <MicNoneOutlinedIcon />}
        </StyledFab>
      </Tooltip>
      <Tooltip title="Manage Space" placement="top" arrow>
        <StyledFab onClick={handleManageSpace}>
          <ManageAccountsIcon />
        </StyledFab>
      </Tooltip>
      <Tooltip title="Mute All" placement="top" arrow>
        <StyledFab sx={muteAll && {background: color.yellow, '&:hover': {background: color.yellow, opacity: '0.8'}}} onClick={handleMuteAllClick}>
          <VolumeUpOutlinedIcon />
        </StyledFab>
      </Tooltip>
      <Tooltip title="Share" placement="top" arrow>
        <StyledFab sx={open && {background: color.yellow, '&:hover': {background: color.yellow, opacity: '0.8'}}} onClick={handleClick}>
          <ShareOutlinedIcon />
        </StyledFab>
      </Tooltip>
      <SettingsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} open={open} />
    </Stack>
  );
};

export default SpaceFooterActions;
