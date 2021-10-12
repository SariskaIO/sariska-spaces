import { Box, Stack, styled, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { color } from "../../../assets/colors";
import { USER_ROLE } from "../../../constants";
import { localParticipantData } from "../../../data";
import { getUserProfile } from "../../../utils";
import AvatarBox from "../AvatarBox";
import ContextMenu from "../ContextMenu";
//import CaptionBox from '../../../shared/CaptionBox';

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
  const profile = useSelector((state) => state.profile);
  const conference = useSelector((state) => state.conference);
  const localTracks = useSelector((state) => state.localTrack);
  const remoteTracks = useSelector((state) => state.remoteTrack);
  const localUser = conference.getLocalUser();
  const space = useSelector((state) => state.space);
  const layout = useSelector((state) => state.layout.raisedHandParticipantIds);

  //merge local and remote track
  let tracks = {
    ...remoteTracks,
    [localUser.id]: localTracks,
  };

  const participantIds = Object.keys(tracks);
  console.log("numpr", space.host, space, layout);

  const handleContextHostMenu = (event) => {
    event.preventDefault();
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

  const handleContextCoHostMenu = (event) => {
    event.preventDefault();
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
  const handleContextSpeakerMenu = (event) => {
    event.preventDefault();
    setContextSpeakerMenu(
      contextSpeakerMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };
  const handleContextListenerMenu = (event) => {
    event.preventDefault();
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
    setContextHostMenu(null);
  };

  const handleCoHostMenuClose = (text) => {
    setContextCoHostMenu(null);
  };
  const handleSpeakerMenuClose = (text) => {
    setContextCoHostMenu(null);
  };
  const handleListenerMenuClose = (text) => {
    setContextCoHostMenu(null);
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

  const hostMenu = [
    { title: "Turn into Co-host" },
    { title: "Mute" },
    // host: [
    // {title: 'Turn into Co-host'},
    // {title: 'Mute'}
    // ]
  ];
  const coHostMenu = [
    { title: "Make Host" },
    { title: "Make Speaker" },
    { title: "Mute" },
    { title: "Remove Co-host" },
  ];
  // host: [
  //   {title: 'Make Host'},
  //   {title: 'Make Speaker'},
  //   {title: 'Mute'},
  //   {title: 'Remove Co-host'}
  // ],
  // cohost: [
  //   {title: 'Mute'},
  // ]

  const speakerMenu = [
    { title: "Make Co-host", onClick: (id) => conference.grantOwner(id) },
    { title: "Make Listener" },
    { title: "Mute" },
    { title: "Remove Speaker" },
    // host: [
    // {title: 'Make Co-host', onClick: (id)=>conference.grantOwner(id)},
    // {title: 'Make Listener'},
    // {title: 'Mute'},
    // {title: 'Remove Speaker'}
    // ],
    // cohost: [
    // {title: 'Make Listener'},
    // {title: 'Mute'},
    // {title: 'Remove Speaker'}
    // ],
    // speaker: [
    //   {title: 'Mute'},
    // ]
  ];
  const listenerMenu = [
    { title: "Make Speaker" },
    { title: "Mute" },
    { title: "Remove Listener" },
  ];
  // host: [
  //   {title: 'Make Speaker'},
  //   {title: 'Mute'},
  //   {title: 'Remove Listener'}
  // ],
  // cohost: [
  //   {title: 'Make Speaker'},
  //   {title: 'Mute'},
  //   {title: 'Remove Listener'}
  // ],
  // listenr: [
  //   {title: 'Mute'},
  // ]

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
          ].map((participant, index) => {
            console.log(
              "party",
              participant._id === space.host,
              participant,
              participant._id,space,
              participant,
              profile
            );

            console.log("party1", space.host, );
            return tracks[participantIds[index]] ? (
              <>
                {space.type.host && participant._id === space.host && (
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
                      participant._role === USER_ROLE.HOST &&
                      handleContextHostMenu
                    }
                  />
                )}
                { space.type.cohost &&
                  participant._id ===
                    space.cohosts.filter((item) => item === participant._id)[0] && (
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
                      participant._role === USER_ROLE.CO_HOST &&
                      handleContextCoHostMenu
                    }
                  />
                ) } 
                { space.type.speaker &&
                  participant._id ===
                    space.speakers.filter(
                      (item) => item === participant._id
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
                      participant._role === USER_ROLE.SPEAKER &&
                      handleContextSpeakerMenu
                    }
                  />
                ) } 
                {space.type.listener &&
                  participant._id ===
                    space.listeners.filter(
                      (item) => item === participant._id
                    )[0] && (
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
                      participant._role === USER_ROLE.LISTENER &&
                      handleContextListenerMenu
                    }
                  />
                )}
                <ContextMenu
                  contextMenu={contextHostMenu}
                  handleContextMenu={handleContextHostMenu}
                  handleClose={handleHostMenuClose}
                  list={hostMenu}
                />
                <ContextMenu
                  contextMenu={contextCoHostMenu}
                  handleContextMenu={handleContextCoHostMenu}
                  handleClose={handleCoHostMenuClose}
                  list={coHostMenu}
                />
                <ContextMenu
                  contextMenu={contextSpeakerMenu}
                  handleContextMenu={handleContextSpeakerMenu}
                  handleClose={handleSpeakerMenuClose}
                  list={speakerMenu}
                />
                <ContextMenu
                  contextMenu={contextSpeakerMenu}
                  handleContextMenu={handleContextListenerMenu}
                  handleClose={handleListenerMenuClose}
                  list={listenerMenu}
                />
              </>
            ) : null;
          })}
          {/* <AvatartBox name="Sachin" authority="Co-host" />
                <AvatartBox name="Rahul" authority="Speaker" />
                <AvatartBox name="Hari" authority="Listener" />
                <AvatartBox name="George" authority="Speaker" />
                <AvatartBox name="Sanny" authority="Listener" />
                <AvatartBox name="Chandan" authority="Listener" />
                <AvatartBox name="James" authority="Speaker" />
                <AvatartBox name="Herbert" authority="Listener" />
                <AvatartBox name="Jhingle" authority="Speaker" />
                <AvatartBox name="Anuj" authority="Listener" />
                <AvatartBox name="Hanskia" authority="Listener" /> */}
        </AvatarContainerBox>
        {/* <CaptionBox /> */}
      </Stack>
    </Box>
  );
};

export default ParticipantsList;
