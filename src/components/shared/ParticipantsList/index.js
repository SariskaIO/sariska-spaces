import { Box, Stack, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { color } from "../../../assets/colors";
import { USER_ROLE } from "../../../constants";
import { localParticipantData } from "../../../data";
import { getUserProfile } from "../../../utils";
import AvatarBox from "../AvatarBox";
import ContextMenu from "../ContextMenu";
//import CaptionBox from '../../../shared/CaptionBox';
import {localTrackMutedChanged, remoteTrackMutedChanged} from '../../../store/actions/track';

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
  const [participantId, setParticipantId] = useState('');
  const spaceTitle = useSelector((state) => state.profile?.spaceTitle);
  const profile = useSelector((state) => state.profile);
  const conference = useSelector((state) => state.conference);
  const localTracks = useSelector((state) => state.localTrack);
  const remoteTracks = useSelector((state) => state.remoteTrack);
  const localUser = conference.getLocalUser();
  const space = useSelector((state) => state.space);
  const layout = useSelector((state) => state.layout.raisedHandParticipantIds);
  const urlSearchParams = new URLSearchParams(window.location.search);
  let userRole = Object.fromEntries(urlSearchParams?.entries())?.role;
  const dispatch = useDispatch();
  const [audioTrack] = localTracks;

  const roles = space.type.host ? USER_ROLE.HOST : space.type.cohost ? USER_ROLE.CO_HOST : space.type.speaker ? USER_ROLE.SPEAKER : space.type.listener ? USER_ROLE.LISTENER : 'No Role'

  //merge local and remote track
  let tracks = {
    ...remoteTracks,
    [localUser.id]: localTracks,
  };

  const participantIds = Object.keys(tracks);
  console.log("numpr", space.host, space, layout, participantIds);
  

  const handleContextHostMenu = (event, id) => {
    setParticipantId(id);
    setContextHostMenu(
      contextHostMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleContextCoHostMenu = (event, id) => {
    setParticipantId(id);
    setContextCoHostMenu(
      contextCoHostMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  const handleContextSpeakerMenu = (event, id) => {
    setParticipantId(id);
    setContextSpeakerMenu(
      contextSpeakerMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
    console.log('id is', id)
  };
  const handleContextListenerMenu = (event, id) => {
    setParticipantId(id);
    setContextListenerMenu(
      contextListenerMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };

  const handleHostMenuClose = (text) => {
    if(participantId && (text === " Mute") && (userRole.toUpperCase() === USER_ROLE.HOST)){
        audioTrack.mute();
        dispatch(localTrackMutedChanged());
  }
    setContextHostMenu(null);
    
  };
  
  const handleCoHostMenuClose = (text) => {
    if(participantId){
    if(text === "Make Speaker"){
      conference.revokeOwner(participantId)
    }
    if(text === "Mute"){
      if(userRole.toUpperCase() === USER_ROLE.HOST){
        conference.muteParticipant(participantId, 'audio');
        dispatch(remoteTrackMutedChanged());
      }
      if(userRole.toUpperCase() === USER_ROLE.CO_HOST){
        audioTrack.mute();
        dispatch(localTrackMutedChanged());
      }
    }
    if(text === "Remove Co-host"){
      conference.kickParticipant(participantId, "Removing Co-host");
    }
  }
    setContextCoHostMenu(null);
  };
  const handleSpeakerMenuClose = (text) => {
    if(participantId){
      if(text === "Make Co-host") {
        conference.grantOwner(participantId)
      }
      if(text === "Make Listener") {
        console.log('make listener');
      }
      if(text === "Mute") {
        if((userRole.toUpperCase() === USER_ROLE.HOST) || (userRole.toUpperCase() === USER_ROLE.CO_HOST) ){
          conference.muteParticipant(participantId, 'audio');
          dispatch(remoteTrackMutedChanged());
        }
        if(userRole.toUpperCase() === USER_ROLE.SPEAKER){
          audioTrack.mute();
          dispatch(localTrackMutedChanged());
        }
      }
      if(text === "Remove Speaker") {
        conference.kickParticipant(participantId);
      }
    }
      setContextSpeakerMenu(null);
  };
  const handleListenerMenuClose = (text) => {
    if(participantId){
      if(text === "Make Speaker") {
        console.log('Make')
      }
      if(text === "Remove Listener") {
        conference.kickParticipant(participantId);
      }
    }
    setContextListenerMenu(null);
  };

  const handleClose = () => {

    setContextCoHostMenu(null);
    setContextSpeakerMenu(null);
    setContextListenerMenu(null);
  };
  //   const handleCoHostClick = (event) => {
  //     setContextCoHost(event.currentTarget);
  //   };
  //   const handleCoHostClose = () => {
  //     setContextCoHost(null);
  //   };

  const hostMenu = {
    host: [
    {title: 'Mute'}
    ]
  };
  const coHostMenu = {
  host: [
    {title: 'Make Host'},
    {title: 'Make Speaker'},
    {title: 'Mute'},
    {title: 'Remove Co-host'}
  ],
  cohost: [
    {title: 'Mute'},
  ]
}

  const speakerMenu = {
    host: [
    {title: 'Make Co-host', onClick: (id)=>conference.grantOwner(id)},
    {title: 'Make Listener'},
    {title: 'Mute'},
    {title: 'Remove Speaker'}
    ],
    cohost: [
    {title: 'Make Listener'},
    {title: 'Mute'},
    {title: 'Remove Speaker'}
    ],
    speaker: [
      {title: 'Mute'},
    ]
  };
  const listenerMenu = {
  host: [
    {title: 'Make Speaker'},
    {title: 'Mute'},
    {title: 'Remove Listener'}
  ],
  cohost: [
    {title: 'Make Speaker'},
    {title: 'Mute'},
    {title: 'Remove Listener'}
  ],
  listener: [
    {title: 'Request To Speak'},
  ]
}

console.log('cohotsm', userRole.toUpperCase(), USER_ROLE.HOST, coHostMenu?.host, userRole.toUpperCase() === USER_ROLE.HOST, userRole.toUpperCase() === USER_ROLE.CO_HOST, USER_ROLE.CO_HOST, coHostMenu?.cohost);

  return (
    <Box>
      <Stack>
        <Title>{spaceTitle}</Title>
        <AvatarContainerBox>
          {[
            ...conference.getParticipantsWithoutHidden(),
            {
              _identity: { user: localUser },
              _id: localUser.id,
              _role: "moderator",
            },
          ]?.map((participant, index) => {
            console.log(
              "party",
              roles,
              participant._id === space.host,
              participant,
              participant._id,space,
              participant,
              profile
            );
            let id = participant._id;
            return tracks[participantIds[index]] ? (
              <>
                {space.type.host && id === space.host && (
                  <AvatarBox
                    role={USER_ROLE.HOST}
                    key={index}
                    isActiveSpeaker={
                      dominantSpeakerId === participantIds[index]
                    }
                    participantDetails={participant?._identity?.user}
                    participantTracks={tracks[participantIds[index]]}
                    localUserId={conference.myUserId()}
                    onClick={
                      (e)=>handleContextHostMenu(e,id)
                    }
                  />
                )}
                { space.type.cohost &&
                  id === space.coHosts.filter((item) => item === id)[0] && (
                  <AvatarBox
                    role={USER_ROLE.CO_HOST}
                    key={index}
                    isActiveSpeaker={
                      dominantSpeakerId === participantIds[index]
                    }
                    participantDetails={participant?._identity?.user}
                    participantTracks={tracks[participantIds[index]]}
                    localUserId={conference.myUserId()}
                    onClick={
                      (e)=>handleContextCoHostMenu(e,id)
                    }
                  />
                ) } 
                { space.type.speaker &&
                  id === space.speakers.filter(
                      (item) => item === id
                    )[0] && (
                  <AvatarBox
                    role={USER_ROLE.SPEAKER}
                    key={index}
                    isActiveSpeaker={
                      dominantSpeakerId === participantIds[index]
                    }
                    participantDetails={participant?._identity?.user}
                    participantTracks={tracks[participantIds[index]]}
                    localUserId={conference.myUserId()}
                    onClick={
                      (e)=>handleContextSpeakerMenu(e, id)
                    }
                  />
                ) } 
                {space.type.listener &&
                  id === space.listeners.filter(
                      (item) => item === id
                    )[0] && (
                  <AvatarBox
                    role={USER_ROLE.LISTENER}
                    key={index}
                    isActiveSpeaker={
                      dominantSpeakerId === participantIds[index]
                    }
                    participantDetails={participant?._identity?.user}
                    participantTracks={tracks[participantIds[index]]}
                    localUserId={conference.myUserId()}
                    onClick={
                      (e)=>handleContextListenerMenu(e,id)
                    }
                  />
                )}
                {(userRole.toUpperCase() === USER_ROLE.HOST) && 
                <ContextMenu
                  contextMenu={contextHostMenu}
                  handleContextMenu={handleContextHostMenu}
                  handleClose={handleHostMenuClose}
                  list={hostMenu?.host}
                />}
                {((userRole.toUpperCase() === USER_ROLE.HOST) || (userRole.toUpperCase() === USER_ROLE.CO_HOST)) && 
                <ContextMenu
                  contextMenu={contextCoHostMenu}
                  handleContextMenu={handleContextCoHostMenu}
                  handleClose={handleCoHostMenuClose}
                  list={userRole.toUpperCase() === USER_ROLE.HOST ? coHostMenu?.host : (userRole.toUpperCase() === USER_ROLE.CO_HOST) && coHostMenu?.cohost}
                />}
                {((userRole.toUpperCase() === USER_ROLE.HOST) || (userRole.toUpperCase() === USER_ROLE.CO_HOST) || (userRole.toUpperCase() === USER_ROLE.SPEAKER)) && 
                <ContextMenu
                  contextMenu={contextSpeakerMenu}
                  handleContextMenu={handleContextSpeakerMenu}
                  handleClose={handleSpeakerMenuClose}
                  list={(userRole.toUpperCase() === USER_ROLE.HOST ? speakerMenu?.host : userRole.toUpperCase() === USER_ROLE.CO_HOST ? speakerMenu?.cohost : (userRole.toUpperCase() === USER_ROLE.SPEAKER) && speakerMenu?.speaker)}
                />
                  }
                  {((userRole.toUpperCase() === USER_ROLE.HOST) || (userRole.toUpperCase() === USER_ROLE.CO_HOST) || (userRole.toUpperCase() === USER_ROLE.LISTENER)) && 
                <ContextMenu
                  contextMenu={contextListenerMenu}
                  handleContextMenu={handleContextListenerMenu}
                  handleClose={handleListenerMenuClose}
                  list={userRole.toUpperCase() === USER_ROLE.HOST ? listenerMenu.host : (userRole.toUpperCase() === USER_ROLE.CO_HOST) ? listenerMenu.cohost : (userRole.toUpperCase() === USER_ROLE.LISTENER) && listenerMenu?.listener}
                />
                  }
              </>
            ) : null;
          })}
        </AvatarContainerBox>
        {/* <CaptionBox /> */}
      </Stack>
    </Box>
  );
};

export default ParticipantsList;
