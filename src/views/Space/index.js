import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import SariskaMediaTransport from 'sariska-media-transport/build/SariskaMediaTransport';
import ParticipantsGrid from '../../components/space/ParticipantsGrid';
import PermissionDialog from '../../components/shared/PermissionDialog';
import SnackbarBox from '../../components/shared/Snackbar';
import { setAudioLevel } from '../../store/actions/audioIndicator';
import { unreadMessage } from '../../store/actions/chat';
import { addThumbnailColor, removeThumbnailColor } from '../../store/actions/color';
import { clearAllReducers, userRoleChanged } from '../../store/actions/conference';
import { addMessage } from '../../store/actions/message';
import { showNotification } from '../../store/actions/notification';
import { addRemoteTrack, remoteTrackMutedChanged, removeRemoteTrack } from '../../store/actions/track';
import { getRandomColor, getUserById } from '../../utils';
import Home from '../home';
import ParticipantsSummary from '../../components/space/ParticipantsSummary';
import { setRaiseHand } from '../../store/actions/layout';
import ReconnectDialog from '../../components/shared/ReconnectDialog';
import { addParticipant, removeParticipant } from '../../store/actions/participant';

const Space = () => {

    const dispatch = useDispatch();
    const localTracks = useSelector(state => state.localTrack);
    const conference = useSelector(state => state.conference);
    const connection = useSelector(state => state.connection);
    const layout = useSelector(state => state.layout);
    const notification = useSelector(state => state.notification);
    const [dominantSpeakerId, setDominantSpeakerId] = useState(null);
    const [lobbyUserJoined, setLobbyUserJoined] = useState({});
    const [minimize, setMinimize] = useState(false);

    
    const handleMinimize = ()=> {
        setMinimize(!minimize);
    }

    const allowLobbyAccess = () => {
        conference.lobbyApproveAccess(lobbyUserJoined.id);
        setLobbyUserJoined({});
    }

    const denyLobbyAccess = () => {
        conference.lobbyDenyAccess(lobbyUserJoined.id);
        setLobbyUserJoined({});
    }

    const updateNetwork = () => { // set internet connectivity status
        if (!window.navigator.onLine) {
            dispatch(showNotification({
                message: "You lost your internet connection. Trying to reconnect...",
                severity: "info",
                autoHide: false
            }));
        }
        setTimeout(() => {
            if (window.navigator.onLine && !layout.disconnected) {
                dispatch(showNotification({message: "Internet Recovered!!!", autoHide: true, severity: "info"}));
            }
        }, 6000);
        SariskaMediaTransport.setNetworkInfo({isOnline: window.navigator.onLine});
    };

    const destroy = async () => {
        if (conference?.isJoined()) {
           await conference?.leave();
        }
        for (const track of localTracks) {
            await track.dispose();
        }
        await connection?.disconnect();
        window.removeEventListener("offline", updateNetwork);
        window.removeEventListener("online", updateNetwork);
        dispatch(clearAllReducers());
    }

    useEffect(() => {
        if (!conference) {
            return;
        }

        conference.getParticipantsWithoutHidden().forEach(participant=>dispatch(addParticipant(participant)));

        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_ADDED, (track) => {
            if (track.isLocal()) {
                return;
            }
            dispatch(addRemoteTrack(track));
        });
        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_REMOVED, (track) => {
            dispatch(removeRemoteTrack(track));
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_MUTE_CHANGED, (track) => {
            dispatch(remoteTrackMutedChanged());
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.DOMINANT_SPEAKER_CHANGED, (id) => {
            setDominantSpeakerId(id);
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.PARTICIPANT_PROPERTY_CHANGED, (participant, key, oldValue, newValue) => {
            if (key === "handraise" && newValue === "start") {
                dispatch(setRaiseHand({ participantId: participant._id, raiseHand: true}));
            }
            if (key === "handraise" && newValue === "stop") {
                dispatch(setRaiseHand({ participantId: participant._id, raiseHand: false}));
            }
            dispatch(userRoleChanged());
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.USER_ROLE_CHANGED, (id, role) => {
            if (conference.isModerator()) {
                conference.enableLobby();
            }
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.KICKED, (id)=> { // if a user kicked by moderator 
            // kicked participant id
            dispatch(showNotification({message: `Participant ${id} has been removed`, autoHide: true, severity: "info"}));
          });

        conference.addEventListener(SariskaMediaTransport.events.conference.PARTICIPANT_KICKED, (actorParticipant, kickedParticipant, reason) => {
            dispatch(showNotification({message: `${actorParticipant} has removed ${kickedParticipant} for ${reason}`, autoHide: true, severity: "info"}));
        })

        conference.addEventListener(SariskaMediaTransport.events.conference.LOBBY_USER_JOINED, (id, displayName) => {
            new Audio("https://sdk.sariska.io/knock_0b1ea0a45173ae6c10b084bbca23bae2.ogg").play();
            setLobbyUserJoined({id, displayName});
        });
        
        conference.addEventListener(SariskaMediaTransport.events.conference.USER_JOINED, (id, participant) => {
            dispatch(addThumbnailColor({partcipantId: id, color: getRandomColor()}));
            if (!participant._hidden) {
                dispatch(addParticipant(participant));
            }
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.USER_LEFT, (id) => {
            dispatch(removeThumbnailColor(id));
            dispatch(removeParticipant(id));
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.MESSAGE_RECEIVED, (id, text, ts) => {
            dispatch(addMessage({text: text, user: getUserById(id, conference)}));
            if (id !== conference.myUserId()) {
                dispatch(unreadMessage(1))
            }
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.NOISY_MIC, () => {
            dispatch(showNotification({message: "Your mic seems to be noisy", severity: "info"}));
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.TALK_WHILE_MUTED, () => {
            dispatch(showNotification({message: "Trying to speak?  your are muted!!!", severity: "info"}));
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.NO_AUDIO_INPUT, () => {
            dispatch(showNotification({message: "Looks like device has no audio input", severity: "warning"}));
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_AUDIO_LEVEL_CHANGED, (participantId, audioLevel) => {
            dispatch(setAudioLevel({participantId, audioLevel}));
        });

        conference.addCommandListener("subRoleChanged", (data) => {
            
            console.log("addCommandListener", data);

            if (conference.myUserId() === data.partcipantId) {
                conference.setLocalParticipantProperty("subRole", data.role);
                dispatch(userRoleChanged());
            }
        });

        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);
        window.addEventListener("beforeunload", destroy);
        return () => {
            destroy();
        };
    },[conference]);

    if (!conference) {
        return <Home />;
    }
    
    return (
        <div>
            {!minimize && <ParticipantsGrid dominantSpeakerId={dominantSpeakerId} handleMinimize={handleMinimize} />}
            {lobbyUserJoined.id && <PermissionDialog
                denyLobbyAccess={denyLobbyAccess}
                allowLobbyAccess={allowLobbyAccess}
                displayName={lobbyUserJoined.displayName}/>}
            <ParticipantsSummary handleMinimize={handleMinimize}/>
            <SnackbarBox notification={notification}/>
            <ReconnectDialog open={layout.disconnected}/>
        </div>
    )
}

export default Space
