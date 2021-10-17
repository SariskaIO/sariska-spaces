import { Box, Stack, styled, Typography } from "@mui/material";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { color } from "../../../assets/colors";
import { USER_ROLE } from "../../../constants";
import AvatarBox from "../AvatarBox";
import ContextMenu from "../ContextMenu";
//import CaptionBox from '../../../shared/CaptionBox';
import { localTrackMutedChanged, remoteTrackMutedChanged } from '../../../store/actions/track';

const Title = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "0.9rem",
  width: "90%",
  marginTop: "-25px",
  textAlign: "center",
  textTransform: "capitalize",
}));
const AvatarContainerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  flexFlow: "wrap",
  height: "248px",
  overflow: "auto",
  marginTop: theme.spacing(1),
  border: `1px solid ${color.border}`,
  padding: theme.spacing(2, 0),
  borderRadius: "20px",
}));

const ParticipantsList = ({ dominantSpeakerId }) => {
  const [contextHostMenu, setContextHostMenu] = React.useState(null);
  const [contextCoHostMenu, setContextCoHostMenu] = React.useState(null);
  const [contextSpeakerMenu, setContextSpeakerMenu] = React.useState(null);
  const [contextListenerMenu, setContextListenerMenu] = React.useState(null);
  const spaceTitle = useSelector((state) => state.profile?.spaceTitle);
  const conference = useSelector((state) => state.conference);
  const localTracks = useSelector((state) => state.localTrack);
  const remoteTracks = useSelector((state) => state.remoteTrack);
  const profile = useSelector((state) => state.profile);
  const localUser = conference?.getLocalUser();
  const dispatch = useDispatch();
  const [audioTrack] = localTracks;
  const participants = useSelector(state=>state.participant);

  //merge local and remote track
  let tracks = {
    ...remoteTracks,
    [localUser.id]: localTracks,
  };

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

    if (selectedItem === "Make Speaker") {
      conference.setLocalParticipantProperty("subRole", USER_ROLE.SPEAKER);
      conference.revokeOwner(participantId);
    }

    if (selectedItem === "Remove Co-host") {
      conference.kickParticipant(participantId, "Removing Co-host");
    }

    if (selectedItem === "Mute") {
      conference.muteParticipant(participantId, 'audio');
      dispatch(remoteTrackMutedChanged());
    }
    setContextCoHostMenu(null);
  };

  const handleSpeakerMenuClose = (selectedItem, participantId) => {
    if (selectedItem === "Make Co-host") {
      conference.sendCommand("userRoleChanged", { participantId, role: USER_ROLE.CO_HOST });
    }

    if (selectedItem === "Make Listener") {
      conference.sendCommand("userRoleChanged", { participantId, role: USER_ROLE.LISTENER });
    }

    if (selectedItem === "Mute") {
      audioTrack.mute();
      dispatch(localTrackMutedChanged());
    }

    if (selectedItem === "Remove Speaker") {
      conference.kickParticipant(participantId);
    }
    setContextSpeakerMenu(null);
  };

  const handleListenerMenuClose = (selectedItem, participantId) => {
    if (selectedItem === "Make Speaker") {
      conference.sendCommand("userRoleChanged", { participantId, role: USER_ROLE.LISTENER });
    }

    if (selectedItem === "Remove Listener") {
      conference.kickParticipant(participantId);
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

  useEffect(()=>{
     document.addEventListener("click", ()=>{
        //  if (contextHostMenu ) { 
        //     setContextHostMenu(null);
        //  }
        //  if (contextCoHostMenu) {
        //     setContextCoHostMenu(null);
        //  }
        //  if (setContextSpeakerMenu) {
        //     setContextSpeakerMenu(null);
        //  }
        //  if (setContextListenerMenu) {
        //     setContextListenerMenu(null);
        //  }
     });
  },[]);

  console.log("participants", participants);
  
  return (
    <Box>
      <Stack>
        <Title>{spaceTitle}</Title>
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
                participantTracks={tracks[participant._id]}
                localUserId={conference.myUserId()}
                onClick={
                  (e) => handleContextHostMenu(e, participant._id)
                }
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
                participantTracks={tracks[participant._id]}
                localUserId={conference.myUserId()}
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
                participantTracks={tracks[participant._id]}
                localUserId={conference.myUserId()}
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
              <AvatarBox
                role={USER_ROLE.LISTENER}
                key={participant._id}
                isActiveSpeaker={
                  dominantSpeakerId === participant._id
                }
                participantDetails={participant?._identity?.user}
                participantTracks={tracks[participant._id]}
                localUserId={conference.myUserId()}
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
