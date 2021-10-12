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

const InviteSpeakers = () => {
  const profile = useSelector((state) => state.profile);
  return (
      <>
    <CloseBox>
    <CloseOnlyDialogueHeader />
    </CloseBox>
    <ContentBox>
      <StyledBox>
        <Stack>
          <StyledTypography variant="h6">Host</StyledTypography>
          <List sx={{ width: "100%" }}>
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
              <Typography>0 Co-hosts</Typography>
              <Dot>.</Dot>
              <Typography>2 open spots</Typography>
            </StyledCoHosts>
            </Box>
            <StyledButton>Invite Co-hosts</StyledButton>
          </Stack>
          <StyledDivider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
            <StyledTypography variant="h6">Speakers</StyledTypography>
            <StyledCoHosts variant="h6">
              <Typography>0 speakers</Typography>
              <Dot>.</Dot>
              <Typography>10 open spots</Typography>
            </StyledCoHosts>
            </Box>
            <StyledButton>Add Speakers</StyledButton>
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
              <Typography>0 people are listening</Typography>
            </StyledCoHosts>
          </Stack>
        </Stack>
      </StyledBox>
    </ContentBox>
    </>
  );
};

export default InviteSpeakers;
