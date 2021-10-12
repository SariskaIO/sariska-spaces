import React from "react";
import {
  Avatar,
  Box,
  Button,
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
import CloseOnlyDialogueHeader from "../../components/shared/CloseOnlyDialogueHeader";
import ContentBox from "../../components/shared/ContentBox";
import { color } from "../../assets/colors";

const CloseBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: theme.spacing(15),
    right: theme.spacing(2)
  }));
const StyledBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  overflow: 'auto'
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
const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    fontSize: '1rem'
  }));
const StyledDivider = styled(Divider)(({ theme }) => ({
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  }));

const InviteCoHosts = () => {
  const profile = useSelector((state) => state.profile);
  const conference = useSelector(state=>state.conference);
  const localTracks = useSelector(state => state.localTrack);
  const remoteTracks = useSelector(state => state.remoteTrack);
  const avatarColors = useSelector(state => state.color);

  let tracks = {
    ...remoteTracks
  };

  const participantIds = Object.keys(tracks);


  return (
      <>
    <CloseBox>
    <CloseOnlyDialogueHeader />
    </CloseBox>
    <ContentBox>
          <StyledTypography variant="h6" sx={{textAlign: 'center',marginBottom: '8px'}}>Add Co-Hosts</StyledTypography>
          <Typography variant="subtitle2">Add up to 2 Co-hosts</Typography>
      <StyledBox>
        <Stack>
          <List sx={{ width: "100%" }}>
            {[...conference.getParticipantsWithoutHidden()].map((participant, index)=> {
              console.log('partyl', participant, participant._id, conference.myUserId(), profile)
              let participantDetails = participant?._identity?.user;
              let avatarColor = avatarColors[participantDetails?.id];
              return tracks[participantIds[index]] ? (
                <>
                  <StyledListItem>
              <ListItemAvatar>
                <Avatar sx={{bgColor: avatarColor}}>{participantDetails.name?.slice(0, 1).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <StyledListItemText
                primary={participantDetails.name}
                secondary={"@" + participantDetails.name}
              />
            </StyledListItem>
          <StyledDivider />
                </>
              )
               : null
            })}
            
            <StyledListItem>
              <ListItemAvatar>
                <Avatar>{profile.name?.slice(0, 1).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <StyledListItemText
                primary={profile.name}
                secondary={"@" + profile.name}
              />
            </StyledListItem>
          <StyledDivider />
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
        </Stack>
      </StyledBox>
    </ContentBox>
    </>
  );
};

export default InviteCoHosts;
