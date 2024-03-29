import React from "react";
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
import CloseOnlyDialogueHeader from "../../components/shared/CloseOnlyDialogueHeader";
import ContentBox from "../../components/shared/ContentBox";

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

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const InviteCoHosts = () => {
  const profile = useSelector((state) => state.profile);
  const conference = useSelector(state => state.conference);
  const avatarColors = useSelector(state => state.color);

  return (
    <>
      <CloseBox>
        <CloseOnlyDialogueHeader />
      </CloseBox>
      <ContentBox>
        <StyledTypography variant="h6" sx={{ textAlign: 'center', marginBottom: '8px' }}>Add Co-Hosts</StyledTypography>
        <Typography variant="subtitle2">Add up to 2 Co-hosts</Typography>
        <StyledBox>
          <Stack>
            <List sx={{ width: "100%" }}>
              {conference.getParticipantsWithoutHidden().map(participant => {
                let participantDetails = participant?._identity?.user;
                let avatarColor = avatarColors[participant?._id];

                return (<><StyledListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgColor: avatarColor }}>{participantDetails.name?.slice(0, 1).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <StyledListItemText
                    primary={participantDetails.name}
                    secondary={"@" + participantDetails.name}
                  />
                </StyledListItem>
                  <StyledDivider /></>)
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
            </List>
          </Stack>
        </StyledBox>
      </ContentBox>
    </>
  );
};

export default InviteCoHosts;
