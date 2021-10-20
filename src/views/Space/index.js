import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import SariskaMediaTransport from 'sariska-media-transport/build/SariskaMediaTransport';
import ParticipantsGrid from '../../components/space/ParticipantsGrid';
import PermissionDialog from '../../components/shared/PermissionDialog';
import SnackbarBox from '../../components/shared/Snackbar';
import { setAudioLevel } from '../../store/actions/audioIndicator';
import { unreadMessage } from '../../store/actions/chat';
import { removeThumbnailColor } from '../../store/actions/color';
import { participantPropertyChanged, updateParticipantRole } from '../../store/actions/participant';
import { clearAllReducers } from '../../store/actions/conference';
import { addMessage } from '../../store/actions/message';
import { showNotification } from '../../store/actions/notification';
import { addRemoteTrack, remoteAllLocalTracks, remoteTrackMutedChanged, removeRemoteTrack } from '../../store/actions/track';
import { getUserById } from '../../utils';
import Home from '../home';
import ParticipantsSummary from '../../components/space/ParticipantsSummary';
import { setRaiseHand } from '../../store/actions/layout';
import ReconnectDialog from '../../components/shared/ReconnectDialog';
import { addParticipant, removeParticipant } from '../../store/actions/participant';
import { addSubRole } from '../../store/actions/profile';
import {USER_ROLE} from "../../constants";
import {addLocalTrack} from "../../store/actions/track";
import RequestToSpeak from '../../components/shared/RequestToSpeak';

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
    const profile = useSelector(state=>state.profile);
    const [requestToSpeak, setRequestToSpeak] = useState(null);

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

    const requestToSpeakAllow = ()=>{
        conference.sendCommand("userRoleChanged", { attributes: {participantId: requestToSpeak.participantId, role: USER_ROLE.SPEAKER }});
        conference.revokeOwner(requestToSpeak.participantId);
        setRequestToSpeak({});
    }

    const requestToSpeakDeny = ()=>{
        setRequestToSpeak({});
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

        conference.addEventListener(SariskaMediaTransport.events.conference.PARTICIPANT_PROPERTY_CHANGED, async(participant, key, oldValue, newValue) => {
            if (key === "handraise" && newValue === "start") {
                dispatch(setRaiseHand({ participantId: participant._id, raiseHand: true}));
            }
            
            if (key === "handraise" && newValue === "stop") {
                dispatch(setRaiseHand({ participantId: participant._id, raiseHand: false}));
            }
            dispatch(participantPropertyChanged());
        });

        // conference.addEventListener(SariskaMediaTransport.events.conference.USER_ROLE_CHANGED, (id, role) => {
        //     if (conference.isModerator()) {
        //         conference.enableLobby();
        //     }
        // });

        conference.addEventListener(SariskaMediaTransport.events.conference.KICKED, (participant)=> { // if a user kicked by moderator 
            // kicked participant id
            console.log('letre', participant._identity.user.name)
            dispatch(showNotification({message: ` Participant ${participant._identity.user.name} has been removed`, autoHide: false, severity: "info"}));
          });

        conference.addEventListener(SariskaMediaTransport.events.conference.PARTICIPANT_KICKED, (actorParticipant, kickedParticipant, reason) => {
            dispatch(showNotification({message: `${actorParticipant} has removed ${kickedParticipant} for ${reason}`, autoHide: true, severity: "info"}));
        })

        // conference.addEventListener(SariskaMediaTransport.events.conference.LOBBY_USER_JOINED, (id, displayName) => {
        //     new Audio("https://sdk.sariska.io/knock_0b1ea0a45173ae6c10b084bbca23bae2.ogg").play();
        //     setLobbyUserJoined({id, displayName});
        // });
        
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

        conference.addCommandListener("userRoleChanged", async(data) => {
            if (conference.myUserId() === data?.attributes?.participantId) {
                const newRole = data?.attributes?.role;
                if ( profile?.subRole === USER_ROLE.LISTENER && (newRole ===  USER_ROLE.SPEAKER || newRole === USER_ROLE.CO_HOST || newRole === USER_ROLE.HOST)) {
                    const options = { devices: ["audio"] };
                    const newLocalTracks = await SariskaMediaTransport?.createLocalTracks(options);
                    newLocalTracks?.forEach((track) => dispatch(addLocalTrack(track)));
                }
    
                if ( newRole === USER_ROLE.LISTENER) {
                    localTracks?.forEach(async track => await track.dispose());
                    dispatch(remoteAllLocalTracks());
                }

                conference.setLocalParticipantProperty("subRole", data?.attributes?.role);
                dispatch(addSubRole(data?.attributes?.role));
                dispatch(updateParticipantRole(data?.attributes));
            }
        });

        conference.addCommandListener("requestToSpeak", async (data) => {
            if (conference.myUserId() === data?.attributes?.hostId) {
                
                console.log("requestToSpeak", requestToSpeak);

                setRequestToSpeak(data?.attributes);
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
            {/* {lobbyUserJoined.id && <PermissionDialog
                denyLobbyAccess={denyLobbyAccess}
                allowLobbyAccess={allowLobbyAccess}
                displayName={lobbyUserJoined.displayName}/>} */}
            <ParticipantsSummary handleMinimize={handleMinimize}/>
            <SnackbarBox notification={notification}/>
            <ReconnectDialog open={layout.disconnected}/>
            {requestToSpeak?.participantId && <RequestToSpeak requestToSpeak={requestToSpeak} allow={requestToSpeakAllow} deny={requestToSpeakDeny} />}
        </div>
    )
}

export default Space
