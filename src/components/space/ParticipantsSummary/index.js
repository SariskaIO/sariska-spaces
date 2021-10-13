import { Fab, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import img from "../../../assets/images/voice.gif";
import { color } from "../../../assets/colors";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import {useHistory} from 'react-router-dom';
import {clearAllTokens} from '../../../utils';

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
const StyledCaption = styled(Typography)(() => ({
  fontSize: "0.6rem",
}));
const ParticipantsSummary = ({ handleDialogue, handleLeave, handleMinimize }) => {
  const profile = useSelector(state=>state.profile);
  const conference = useSelector(state => state.conference);
  const localUser = conference.getLocalUser();
  const history = useHistory();
  const [participants, setParticipants] = useState([]);
  const space = useSelector(state => state.space);
  
  const leaveConference = () => {
    history.push("/leave");
    clearAllTokens();
};
// useEffect(()=>{
//   setParticipants([...conference.getParticipantsWithoutHidden()]);
// },[conference.getParticipantsWithoutHidden()])
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
                      [...conference.getParticipantsWithoutHidden(), {_identity: { user: localUser }, _id: localUser.id, _role: 'moderator'}].map((participant, index)=>{
                        return (participant._id === space.host) && (
                        <Name>
                         { participant?._identity?.user?.name }
                         <StyledCaption variant="caption">( Host )</StyledCaption> 
                  </Name>
                        )
                      })
                    }
                </Stack>
                {([...conference.getParticipantsWithoutHidden()].length)>0 ? (<Name>+ {[...conference.getParticipantsWithoutHidden()].length} others</Name>) : (<Name>No one else is here</Name>) }
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
    </>
  );
};

export default ParticipantsSummary;
