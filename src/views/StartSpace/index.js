import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Box, CircularProgress, Snackbar, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import SariskaMediaTransport from "sariska-media-transport/build/SariskaMediaTransport";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import { color } from "../../assets/colors";
import { clearAllTokens, getRandomColor, getToken, getUserName, getUserRole } from "../../utils";
import { addConnection } from "../../store/actions/connection";
import { setDisconnected } from "../../store/actions/layout";
import { setProfile } from "../../store/actions/profile";
import { makeSpeakers, setHost, setSpace } from "../../store/actions/space";
import { addConference } from "../../store/actions/conference";
import { addThumbnailColor } from "../../store/actions/color";
import { localTrackMutedChanged } from "../../store/actions/track";
import RootButton from "../../components/shared/RootButton";
import ContentBox from "../../components/shared/ContentBox";
import CloseOnlyDialogueHeader from "../../components/shared/CloseOnlyDialogueHeader";
import Switches from "../../components/shared/Switch";
import SelectMenu from "../../components/shared/SelectMenu";
import { localParticipantData } from "../../data";
import { USER_ROLE } from "../../constants";

const StyledBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(0),
  marginTop: '-30px'
}));
const YourSpace = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  textAlign: "center",
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  fontWeight: 600,
}));
const AudioBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  bottom: "20px",
  zIndex: 1,
  marginBottom: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    border: `1px solid ${color.yellow}`,
    padding: "12px",
    borderRadius: "50%",
    marginRight: "18px",
    color: color.yellow,
    "&:hover": {
      background: color.white,
      cursor: "pointer",
    },
  },
}));
const DisableMicOffOutlinedIcon = styled(MicOffOutlinedIcon)(({ theme }) => ({
  background: color.red,
  borderColor: `${color.red} !important`,
  "&:hover": {
    opacity: "0.8",
    background: `${color.red} !important`,
  },
}));

const StartSpace = () => {
  const history = useHistory();
  const [audioTrack] = useSelector((state) => state.localTrack);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [nameId, setNameId] = useState("");
  const [spaceTitle, setSpaceTitle] = useState("");
  const [buttonText, setButtonText] = useState("Create Space");
  const [accessDenied, setAccessDenied] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const profile = useSelector((state) => state.profile);
  const queryParams = useParams();
  const urlSearchParams = new URLSearchParams(window.location.search);
  let spaceType = Object.fromEntries(urlSearchParams?.entries())?.private;

  const handleNameChange = (event) => {
    setNameId(event.target.value);
    dispatch(setProfile( {name: getUserName(localParticipantData, event.target.value), id: event.target.value, role: getUserRole(localParticipantData, event.target.value)}));
  };
  const handleSpaceChange = (event) => {
    setSpaceTitle(event.target.value);
  };

  const handleSubmit = async () => {
    if (!spaceTitle) {
      return;
    }
    setLoading(true);
    let token = localStorage.getItem(`sariska_${spaceTitle}${getUserName(localParticipantData, nameId)}`);
    const isModerator = !queryParams.spaceId;
    token = token ? token : await getToken(spaceTitle, profile, getUserName(localParticipantData, nameId), isModerator);
    if (!token) {
      return;
    }

    const connection = new SariskaMediaTransport.JitsiConnection(token);
    console.log('tokenr', token, isModerator, accessDenied, connection, profile);
    
    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED,
      () => {
        dispatch(addConnection(connection));
        createConference(connection);
        console.log('queryaprr',!queryParams.spaceId, queryParams.spaceId, !(queryParams.spaceId));
      }
    );
    connection.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_FAILED, (error) => {
      if (error === SariskaMediaTransport.errors.connection.CONNECTION_DROPPED_ERROR) {
          dispatch(setDisconnected(true));
      }
  });
    connection.addEventListener(
      SariskaMediaTransport.events.connection.PASSWORD_REQUIRED,
      () => {
        connection.setToken(token); // token expired, set a new token
      }
    );
    connection.connect();

    dispatch(setSpace({ spaceTitle }));
  };
  const createConference = async (connection) => {
    const conference = connection.initJitsiConference();
    conference.addTrack(audioTrack);
      console.log('setlocal', conference.getLocalUser());
      if(!queryParams.spaceId){
        console.log('setlocalq');
      conference.setLocalParticipantProperty("host", "true");
      dispatch(setHost({participantId: conference.getLocalUser().id, host: "true"}))
      }else {
        console.log('setlocals');
      conference.setLocalParticipantProperty("host", "true");
      dispatch(makeSpeakers({participantId: conference.getLocalUser().id, speaker: "true"}))
      }
    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_JOINED,
      () => {
        setLoading(false);
        dispatch(addConference(conference));
        history.push(`/${spaceTitle}?private=${checked}`);
      }
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_ERROR,
      () => {
        setLoading(false);
      }
    );
    conference.addEventListener(SariskaMediaTransport.events.conference.USER_JOINED, (id) => {
      dispatch(addThumbnailColor({participantId: id, color: getRandomColor()}));
  });
  conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_FAILED,
      async (error) => {
        if (
          error === SariskaMediaTransport.errors.conference.MEMBERS_ONLY_ERROR
        ) {
          (checked === "true") && setButtonText("Asking to join");
          conference.joinLobby(getUserName(localParticipantData, nameId));
        }

        if (
          error ===
          SariskaMediaTransport.errors.conference.CONFERENCE_ACCESS_DENIED
        ) {
          setAccessDenied(true);
          setButtonText("Join Space");
          setLoading(false);
          setTimeout(() => setAccessDenied(false), 2000);
        }
      }
    );

    conference.join();
  };
  const unmuteAudioLocalTrack = async () => {
    await audioTrack.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteAudioLocalTrack = async () => {
    await audioTrack.mute();
    dispatch(localTrackMutedChanged());
  };
  
  useEffect(() => {
    if (queryParams.spaceId) {
      setButtonText("Join Space");
      setSpaceTitle(queryParams.spaceId);
      setChecked(spaceType);
    }
    setNameId(profile.id);
  }, [profile]);


const handleClose = () => {
  clearAllTokens()
  history.push('/');
}
console.log('query', queryParams, profile, nameId, localParticipantData, getUserName(localParticipantData, nameId))
  return (
    <ContentBox>
      <CloseOnlyDialogueHeader handleLeave={handleClose} closeTitle="Don't Create a Space"/>
    <StyledBox>
      <Stack>
        <YourSpace variant="h5">Your Space</YourSpace>
        <Typography variant="subtitle2" sx={{ textAlign: "center", py: 2 }}>
          As Spaces are Public, anyone can join your space
        </Typography>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "30ch" },
            margin: "auto",
            mt: 2,
            mb: 2.5,
            "& label": {
              fontWeight: 600,
              "&.Mui-focused": {
                color: color.gray,
              },
            },
            "&.MuiInputBase-root-MuiInput-root:after": {
              borderBottom: `2px solid ${color.gray}`,
            },
          }}
          noValidate
          autoComplete="off"
        >
          <SelectMenu  nameId={nameId} setNameId={setNameId} handleChange={handleNameChange} list={localParticipantData}/>
          {/* <StyledTextField
            id="filled-name"
            label="Enter Your Name"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            value={name}
            onChange={handleNameChange}
            sx={{ color: "red !important" }}
          /> */}
          <StyledTextField
            id="filled-number"
            label="Name Your Space"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            value={spaceTitle}
            onChange={handleSpaceChange}
            sx={{ color: "red !important" }}
          />
          <Switches disabled={queryParams.spaceId ? true : false} setChecked ={setChecked} checked={checked}/>
        </Box>
        <AudioBox>
          {audioTrack?.isMuted() ? (
            <Tooltip title="Unmute Audio" arrow>
              <DisableMicOffOutlinedIcon onClick={unmuteAudioLocalTrack} />
            </Tooltip>
          ) : (
            <Tooltip title="Mute Audio" arrow>
              <MicNoneOutlinedIcon onClick={muteAudioLocalTrack} />
            </Tooltip>
          )}
        </AudioBox>
        <Box sx={{ pt: 1 }}>
          <RootButton
            variant="extended"
            size="large"
            buttonText={buttonText}
            width="100%"
            onClick={handleSubmit}
            disabled={loading}
          />
        </Box>
        {loading && (
                        <CircularProgress size={24} sx={{color:color.yellow, marginTop: '-60px', marginLeft: '100px'}}/>
                    )}
        <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={2000}
                open={accessDenied}
                message="Conference access denied by moderator"
            />
      </Stack>
    </StyledBox>
    </ContentBox>
  );
};

export default StartSpace;
