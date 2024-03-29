import React from "react";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

const StyledBox = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  width: '90%',
  margin: 'auto'
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

const StyledAvatar = styled(Avatar)(()=>({
  width: '30px',
  height: '30px',
  fontSize: '1rem'
}));

const ParticipantTypeList = ({type}) => {
      const participants = useSelector(state=>state.participant);

  // let list = participants.filter(participant => participant._properties?.subRole == type);

  // console.log('ppt', participants, type, list);
  
  return (
            <StyledBox>
              <Stack>
                <List sx={{ width: "100%", paddingTop: '0px' }}>
                  {participants.filter(participant => participant._properties?.subRole == type)?.map((participant, index) =>(
                  <StyledListItem key={index}>
                    <ListItemAvatar sx={{minWidth: '40px'}}>
                      <StyledAvatar>{participant._identity?.user?.name?.slice(0, 1).toUpperCase()}</StyledAvatar>
                    </ListItemAvatar>
                    <StyledListItemText
                      secondary={"@" + participant._identity?.user?.name}
                    />
                  </StyledListItem>
                  ))}
                </List>
              </Stack>
            </StyledBox>
    );
};

export default ParticipantTypeList;
