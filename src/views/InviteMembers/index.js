import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { color } from "../../assets/colors";
import GoBack from "../../components/shared/GoBack";
import ParticipantTypeList from "../../components/shared/ParticipantTypeList";

const CloseBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 0,
    right: theme.spacing(2),
    zIndex: 3
}));

const StyledBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  overflow: 'auto',
  width: '90%',
  margin: 'auto'
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  fontWeight: 600,
  fontSize: '1.1rem'
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "&>span": {
    textTransform: "capitalize",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: "0px",
  paddingRight: "0px",
}));

const StyledCoHosts = styled(Typography)(({ theme }) => ({
  color: color.text,
  display: "flex",
  flexDirection: "row",
}));


const Dot = styled(Typography)(({ theme }) => ({
  color: color.text,
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(-0.5),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(1),
}));

const InviteMembers = ({handleClose}) => {
      const profile = useSelector((state) => state.profile);
      const participants = useSelector(state=>state.participant);
      const [openCohostList, setOpenCohostList] = useState(false);
      const [openSpeakerList, setOpenSpeakerList] = useState(false);
      const [openListenerList, setOpenListenerList] = useState(false);

      const handleClickParticipantList=(e, text) => {
        if(text === "cohost") {setOpenCohostList(!openCohostList);}
        if(text === "speaker") {setOpenSpeakerList(!openSpeakerList);}
        if(text === "listener") {setOpenListenerList(!openListenerList);}
      }


  return (
        <>
          <CloseBox>
            <GoBack handleLeave={handleClose} title="Go Back" />
          </CloseBox>
            <StyledBox>
              <Stack>
                <StyledTypography variant="h6">Host</StyledTypography>
                <List sx={{ width: "100%", paddingTop: '0px' }}>
                  <StyledListItem>
                    <ListItemAvatar>
                      <Avatar>{profile.name?.slice(0, 1).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <StyledListItemText
                      primary={profile.name}
                      secondary={"@" + profile.name}
                    />
                  </StyledListItem>
                </List>
                <Divider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <StyledTypography variant="h6">Co-hosts</StyledTypography>
                    <StyledCoHosts variant="h6">
                      <Typography onClick={(e)=>handleClickParticipantList(e, "cohost")}>
                      {participants.filter(participant => participant._properties.subRole === "cohost").length > 0 ? <u style={{cursor: 'pointer'}}>{participants.filter(participant => participant._properties.subRole === "cohost").length}</u> :
                      0
                      }
                      {" "}
                         Co-hosts</Typography>
                      <Dot>.</Dot>
                      <Typography>{2 - participants.filter(participant => participant._properties.subRole === "cohost").length} open spots</Typography>
                    </StyledCoHosts>
                    {openCohostList && <ParticipantTypeList handleClose = {(e)=>handleClickParticipantList(e, "cohost")} type="cohost"/>}
                  </Box>
                </Stack>
                <StyledDivider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                      <StyledTypography variant="h6">Speakers</StyledTypography>
                      <StyledCoHosts variant="h6">
                        <Typography onClick={(e)=>handleClickParticipantList(e, "speaker")}>
                          {participants.filter(participant => participant._properties.subRole === "speaker").length>0 ? <u style={{cursor: 'pointer'}}>{participants.filter(participant => participant._properties.subRole === "speaker").length}</u>
                          : 0 }
                          {' '}
                           Speakers</Typography>
                        <Dot>.</Dot>
                        <Typography>{10 - participants.filter(participant => participant._properties.subRole === "speaker").length} open spots</Typography>
                      </StyledCoHosts>
                    {openSpeakerList && <ParticipantTypeList handleClose = {(e)=>handleClickParticipantList(e, "speaker")} type="speaker" />}
                  </Box>
                </Stack>
                <StyledDivider />
                <Stack>
                  <StyledTypography variant="h6">Requests to Speak</StyledTypography>
                  <StyledCoHosts variant="h6">
                    <Typography>0 requests</Typography>
                  </StyledCoHosts>
                </Stack>
                <StyledDivider />
                <Stack>
                    <StyledTypography variant="h6">Listeners</StyledTypography>
                    <StyledCoHosts variant="h6">
                      <Typography onClick={(e)=>handleClickParticipantList(e, "listener")}>
                        {participants.filter(participant => participant._properties.subRole === "listener").length>0 ? <u style={{cursor: 'pointer'}}>{participants.filter(participant => participant._properties.subRole === "listener").length}</u> : 0} people are listening</Typography>
                    </StyledCoHosts>
                    {openListenerList && <ParticipantTypeList handleClose = {(e)=>handleClickParticipantList(e, "listener")} type="listener"/>}
                </Stack>
              </Stack>
            </StyledBox>
      </>
    );
};

export default InviteMembers;
