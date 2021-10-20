import { Box, Divider, Stack, styled, Typography } from "@mui/material";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { color } from "../../../assets/colors";
import { USER_ROLE } from "../../../constants";
import AvatarBox from "../AvatarBox";
import ContextMenu from "../ContextMenu";
//import CaptionBox from '../../../shared/CaptionBox';

const Title = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "1.5rem",
  width: "90%",
  marginTop: "-25px",
  textTransform: "capitalize",
  marginLeft: '10px'
}));
const StyledDivider = styled(Divider)(() => ({
  width: '30%',
  borderBottomWidth: 'thick',
  borderColor: color.yellow,
  marginTop: '0.8rem',
  marginBottom: '1.3rem',
  marginLeft: '10px'
}));
const AvatarContainerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  flexFlow: "wrap",
  height: "248px",
  width: '90%',
  overflow: "auto",
  marginTop: theme.spacing(1),
  border: `1px solid ${color.border}`,
  padding: theme.spacing(2, 0),
  borderRadius: "40px",
  margin: 'auto'
}));

const ParticipantsList = ({ dominantSpeakerId, localHandRaise }) => {
  const [contextHostMenu, setContextHostMenu] = React.useState(null);
  const [contextCoHostMenu, setContextCoHostMenu] = React.useState(null);
  const [contextSpeakerMenu, setContextSpeakerMenu] = React.useState(null);
  const [contextListenerMenu, setContextListenerMenu] = React.useState(null);
  const spaceTitle = useSelector((state) => state.profile?.spaceTitle);
  const conference = useSelector((state) => state.conference);
  const profile = useSelector((state) => state.profile);
  const participants = useSelector(state=>state.participant);

  const handleContextHostMenu = (event, id) => {
    setContextHostMenu(
      contextHostMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        }
        :
        null
    );
  };

  const handleContextCoHostMenu = (event, id) => {
    setContextCoHostMenu(
      contextCoHostMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        }
        :
        null
    );
  };

  const handleContextSpeakerMenu = (event, id) => {
    setContextSpeakerMenu(
      contextSpeakerMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        }
        : null
    );
  };

  const handleContextListenerMenu = (event, id) => {
    setContextListenerMenu(
      contextListenerMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        }
        : null
    );
  };

  const handleHostMenuClose = (selectedItem) => {
    setContextHostMenu(null);
  };

  const handleCoHostMenuClose = (selectedItem, participantId) => {

    if (selectedItem === "Make Host") {
      conference.sendCommand("userRoleChanged", { attributes: {participantId, role: USER_ROLE.HOST }});
      conference.grantOwner(participantId);
    }

    if (selectedItem === "Make Speaker") {
      conference.sendCommand("userRoleChanged", { attributes: {participantId, role: USER_ROLE.SPEAKER }});
      conference.revokeOwner(participantId);
    }

    if (selectedItem === "Remove Co-host") {
      conference.kickParticipant(participantId, "Removing Co-host");
    }

    if (selectedItem === "Mute") {
      conference.muteParticipant(participantId, 'audio');
    }
    setContextCoHostMenu(null);
  };

  const handleSpeakerMenuClose = (selectedItem, participantId) => {
    if (selectedItem === "Make Co-host") {
      conference.sendCommand("userRoleChanged", { attributes: {participantId, role: USER_ROLE.CO_HOST }});
      conference.grantOwner(participantId);
    }

    if (selectedItem === "Make Listener") {
      conference.sendCommand("userRoleChanged", { attributes:{participantId, role: USER_ROLE.LISTENER }});
    }

    if (selectedItem === "Mute") {
      conference.muteParticipant(participantId, "audio");
    }

    if (selectedItem === "Remove Speaker") {
      conference.kickParticipant(participantId);
    }
    setContextSpeakerMenu(null);
  };

  const handleListenerMenuClose = (selectedItem, participantId) => {
    if (selectedItem === "Make Speaker") {
      conference.sendCommand("userRoleChanged", { attributes: { participantId, role: USER_ROLE.SPEAKER }});
    }

    if (selectedItem === "Remove Speaker") {
      conference.kickParticipant(participantId);
    }

    if (selectedItem === "Mute") {
      conference.muteParticipant(participantId, "audio");
    }

    if (selectedItem === "Remove Listener") {
      conference.kickParticipant(participantId);
    }

    if (selectedItem === "Request To Speak") {
      console.log("Request To Speak");
       const participant = conference.getParticipantsWithoutHidden().find(item=>item._properties.subRole === USER_ROLE.HOST);
       conference.sendCommandOnce("requestToSpeak", { attributes: { participantId, hostId:  participant._id, participantName: participants.find(item=>item._id === participantId)?._identity?.user?.name}});
    }
    setContextListenerMenu(null);
  };

  const handleClose = () => {
    setContextCoHostMenu(null);
    setContextSpeakerMenu(null);
    setContextListenerMenu(null);
  };

  const hostMenu = {
    host: []
  };

  const coHostMenu = {
    host: [
      { title: 'Make Host' },
      { title: 'Make Speaker' },
      { title: 'Mute' },
      { title: 'Remove Co-host' }
    ],
    cohost: []
  }

  const speakerMenu = {
    host: [
      { title: 'Make Co-host' },
      { title: 'Make Listener' },
      { title: 'Mute' },
      { title: 'Remove Speaker' }
    ],
    cohost: [
      { title: 'Make Listener' },
      { title: 'Mute' },
      { title: 'Remove Speaker' }
    ],
    speaker: []
  };

  const listenerMenu = {
    host: [
      { title: 'Make Speaker' },
      { title: 'Mute' },
      { title: 'Remove Listener' }
    ],
    cohost: [
      { title: 'Make Speaker' },
      { title: 'Mute' },
      { title: 'Remove Listener' }
    ],
    listener: [
      { title: 'Request To Speak' },
    ]
  }


  console.log("participants", participants, conference.getParticipantsWithoutHidden());

  return (
    <Box>
      <Stack sx={{marginTop: '-7px'}}>
        <Title>{spaceTitle}</Title>
        <StyledDivider />
        <AvatarContainerBox>
          {participants.map(participant =>
            participant._properties?.subRole === USER_ROLE.HOST && <>
              <AvatarBox
                role={USER_ROLE.HOST}
                key={participant._id}
                isActiveSpeaker={
                  dominantSpeakerId === participant._id
                }
                participantDetails={participant?._identity?.user}
                localUserId={conference.myUserId()}
                onClick={
                  (e) => handleContextHostMenu(e, participant._id)
                }
                localHandRaise={localHandRaise}
              />
              <ContextMenu
                contextMenu={contextHostMenu}
                participantId = {participant._id}
                handleContextMenu={handleContextHostMenu}
                handleClose={handleHostMenuClose}
                list={hostMenu[profile?.subRole]}
              /></>
          )}

          {participants.map(participant =>
            participant._properties?.subRole === USER_ROLE.CO_HOST && <>
              <AvatarBox
                role={USER_ROLE.CO_HOST}
                key={participant._id}
                isActiveSpeaker={
                  dominantSpeakerId === participant._id
                }
                participantDetails={participant?._identity?.user}
                localUserId={conference.myUserId()}
                localHandRaise={localHandRaise}
                onClick={
                  (e) => handleContextCoHostMenu(e, participant._id)
                }
              />
              <ContextMenu
                contextMenu={contextCoHostMenu}
                participantId = {participant._id}
                handleContextMenu={handleContextCoHostMenu}
                handleClose={handleCoHostMenuClose}
                list={coHostMenu[profile?.subRole]}
              />
            </>
          )}

          {participants.map(participant =>
            participant._properties?.subRole === USER_ROLE.SPEAKER && <>
              <AvatarBox
                role={USER_ROLE.SPEAKER}
                key={participant._id}
                isActiveSpeaker={
                  dominantSpeakerId === participant._id
                }
                participantDetails={participant?._identity?.user}
                localUserId={conference.myUserId()}
                localHandRaise={localHandRaise}
                onClick={
                  (e) => handleContextSpeakerMenu(e, participant._id)
                }
              />
              <ContextMenu
                contextMenu={contextSpeakerMenu}
                participantId = {participant._id}
                handleContextMenu={handleContextSpeakerMenu}
                handleClose={handleSpeakerMenuClose}
                list={speakerMenu[profile?.subRole]}
              /></>
          )}

          {participants.map(participant =>
             participant._properties?.subRole === USER_ROLE.LISTENER && <>
              {console.log(participant)}
              <AvatarBox
                role={USER_ROLE.LISTENER}
                key={participant._id}
                isActiveSpeaker={
                  dominantSpeakerId === participant._id
                }
                participantDetails={participant?._identity?.user}
                localUserId={conference.myUserId()}
                localHandRaise={localHandRaise}
                onClick={
                  (e) => handleContextListenerMenu(e, participant._id)
                }
              />
              <ContextMenu
                contextMenu={contextListenerMenu}
                handleContextMenu={handleContextListenerMenu}
                participantId = {participant._id}
                handleClose={handleListenerMenuClose}
                list={listenerMenu[profile?.subRole]}
              /></>
          )}
        </AvatarContainerBox>
      </Stack>
    </Box>
  );
};

export default ParticipantsList;
