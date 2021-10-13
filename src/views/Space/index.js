import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import SariskaMediaTransport from 'sariska-media-transport/build/SariskaMediaTransport';
import ParticipantsGrid from '../../components/space/ParticipantsGrid';
import PermissionDialog from '../../components/shared/PermissionDialog';
import SnackbarBox from '../../components/shared/Snackbar';
import { setAudioLevel } from '../../store/actions/audioIndicator';
import { unreadMessage } from '../../store/actions/chat';
import { addThumbnailColor, removeThumbnailColor } from '../../store/actions/color';
import { clearAllReducers } from '../../store/actions/conference';
import { addMessage } from '../../store/actions/message';
import { showNotification } from '../../store/actions/notification';
import { addRemoteTrack, remoteTrackMutedChanged, removeRemoteTrack } from '../../store/actions/track';
import { clearAllTokens, getRandomColor, getUserById, useQuery } from '../../utils';
import Home from '../home';
import ParticipantsSummary from '../../components/space/ParticipantsSummary';
import { setRaiseHand } from '../../store/actions/layout';
import ReconnectDialog from '../../components/shared/ReconnectDialog';
import { useParams } from 'react-router-dom';
import { makeListeners, makeSpeakers, setCoHosts, setHost } from '../../store/actions/space';
import { Snackbar } from '@mui/material';

const Space = () => {

    const dispatch = useDispatch();
    const localTracks = useSelector(state => state.localTrack);
    const conference = useSelector(state => state.conference);
    const connection = useSelector(state => state.connection);
    const layout = useSelector(state => state.layout);
    const notification = useSelector(state => state.notification);
    const profile = useSelector(state => state.profile);
    const [dominantSpeakerId, setDominantSpeakerId] = useState(null);
    const [lobbyUserJoined, setLobbyUserJoined] = useState({});
    const [minimize, setMinimize] = useState(false);
    const [roleChanged, setRoleChanged] = useState(false);
    const [message, setMessage] = useState(false);
    const queryParams = useParams();
    const query = useQuery();
    const urlSearchParams = new URLSearchParams(window.location.search);
    let spaceType = Object.fromEntries(urlSearchParams?.entries())?.private;

    
    const handleMinimize = ()=> {
        setMinimize(!minimize);
    }

    const allowLobbyAccess = () => {
        (spaceType==="true") && conference.lobbyApproveAccess(lobbyUserJoined.id)
        setLobbyUserJoined({});
    }
    const denyLobbyAccess = () => {
        (spaceType==="true") && conference.lobbyDenyAccess(lobbyUserJoined.id);
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
        }, 3000);
        SariskaMediaTransport.setNetworkInfo({isOnline: window.navigator.onLine});
    };

    const destroy = async () => {
        if (conference?.isJoined()) {
           // await conference?.leave();
        }
        for (const track of localTracks) {
            await track.dispose();
        }
        await connection?.disconnect();
        window.removeEventListener("offline", updateNetwork);
        window.removeEventListener("online", updateNetwork);
        dispatch(clearAllReducers());
        clearAllTokens();
    }

    useEffect(() => {
        if (!conference) {
            return;
        }
        [...conference.getParticipantsWithoutHidden()].forEach(item=>{
            if (item._properties?.handraise === "start") {
                dispatch(setRaiseHand({ participantId: item._id, raiseHand: true}));
            }
            if(item._properties?.host === "true"){
                dispatch(setHost({participantId: item._id, host: "true"}));
            }
            if(item._properties?.cohost === "true"){
                dispatch(setCoHosts({participantId: item._id, cohost: "true"}));
            }
            if(item._properties?.speaker === "true"){
                dispatch(makeSpeakers({participantId: item._id, speaker: "true"}));
            }
            if(item._properties?.listener === "true"){
                dispatch(makeListeners({participantId: item._id, listener: "true"}));
            }
        });
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
            if (key === "host" && newValue === "true") {
                dispatch(setHost({ participantId: participant._id, host: "true"}));
            }
            if (key === "cohost" && newValue === "true") {
                dispatch(setCoHosts({ participantId: participant._id, cohost: "true"}));
            }
            if (key === "speaker" && newValue === "true") {
                dispatch(makeSpeakers({ participantId: participant._id, speaker: "true"}));
            }
            if (key === "listener" && newValue === "true") {
                dispatch(makeListeners({ participantId: participant._id, listener: "true"}));
            }
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.USER_ROLE_CHANGED, (id, role) => {
            if (conference.isModerator()) {
                conference.enableLobby();
            }
            if(conference.user.id){
                setRoleChanged(true);
                setMessage(`My Role changed, new role is :  ${role}`)
            }else {
                setRoleChanged(true);
                setMessage(`Participant ${id} Role changed, new role is : ${role}`)
            }

        });

        conference.addEventListener(SariskaMediaTransport.events.conference.KICKED, (id)=> { // if a user kicked by moderator 
            // kicked participant id
            alert(`${id} has been removed`);
          });

        conference.addEventListener(SariskaMediaTransport.events.conference.PARTICIPANT_KICKED, (actorParticipant, kickedParticipant, reason) => {
            alert(`${actorParticipant} has removed ${kickedParticipant} for ${reason}`);
        })

        conference.addEventListener(SariskaMediaTransport.events.conference.LOBBY_USER_JOINED, (id, displayName) => {
            new Audio("https://sdk.sariska.io/knock_0b1ea0a45173ae6c10b084bbca23bae2.ogg").play();
            setLobbyUserJoined({id, displayName});
        });
        conference.addEventListener(SariskaMediaTransport.events.conference.USER_JOINED, (id) => {
            dispatch(addThumbnailColor({partcipantId: id, color: getRandomColor()}));
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.USER_LEFT, (id) => {
            dispatch(removeThumbnailColor(id));
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

        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);
        window.addEventListener("beforeunload", destroy);
        return () => {
            destroy();
        };
    },[conference]);

    if (!conference || !conference.isJoined()) {
        return <Home />;
    }
    return (
        <div>
            {!minimize && <ParticipantsGrid dominantSpeakerId={dominantSpeakerId} handleMinimize={handleMinimize} />}
            {spaceType === "true" && lobbyUserJoined.id && <PermissionDialog
                denyLobbyAccess={denyLobbyAccess}
                allowLobbyAccess={allowLobbyAccess}
                displayName={lobbyUserJoined.displayName}/>}
            <ParticipantsSummary handleMinimize={handleMinimize}/>
            <SnackbarBox notification={notification}/>
            <ReconnectDialog open={layout.disconnected}/>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={2000}
                open={roleChanged}
                message="Conference access denied by moderator"
            />
        </div>
    )
}

export default Space
