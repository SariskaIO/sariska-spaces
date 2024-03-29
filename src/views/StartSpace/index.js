import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import SariskaMediaTransport from "sariska-media-transport";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import { color } from "../../assets/colors";
import { getRandomColor, getToken } from "../../utils";
import { addConnection } from "../../store/actions/connection";
import { setDisconnected } from "../../store/actions/layout";
import { setProfile, addSpaceTitle, addSubRole, addSpaceType } from "../../store/actions/profile";
import { addConference } from "../../store/actions/conference";
import { addThumbnailColor } from "../../store/actions/color";
import { localTrackMutedChanged } from "../../store/actions/track";
import RootButton from "../../components/shared/RootButton";
import ContentBox from "../../components/shared/ContentBox";
import CloseOnlyDialogueHeader from "../../components/shared/CloseOnlyDialogueHeader";
//import Switches from "../../components/shared/Switch";
import SelectMenu from "../../components/shared/SelectMenu";
import { localParticipantData } from "../../data";
import { USER_ROLE } from "../../constants";
import { addParticipant } from "../../store/actions/participant";

const StyledBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(0),
  marginTop: "-30px",
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
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    border: `1px solid ${color.primary}`,
    padding: "12px",
    borderRadius: "50%",
    marginRight: "18px",
    color: color.primary,
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
  const [spaceTitle, setSpaceTitle] = useState("");
  const [buttonText, setButtonText] = useState("Create Stage");
  const [accessDenied, setAccessDenied] = useState(false);
  const [name, setName] = useState("");
  //const [checked, setChecked] = React.useState(false);
  const profile = useSelector((state) => state.profile);
  const queryParams = useParams();
  const urlSearchParams = new URLSearchParams(window.location.search);
  let spaceType = Object.fromEntries(urlSearchParams?.entries())?.spacetype;
  let userRole = Object.fromEntries(urlSearchParams?.entries())?.role || profile?.subRole

  const handleNameChange = (event) => {
    setName(event.target.value)
  };

  const handleSpaceChange = (event) => {
    setSpaceTitle(event.target.value);
  };

  const handleSubmit = async () => {
    let token;

    if (!spaceTitle) {
        return;
    }

    setLoading(true);

    const isModerator = !queryParams.spaceId || userRole === USER_ROLE.HOST || userRole === USER_ROLE.CO_HOST;
    token = await getToken(name, isModerator);

    if (!token) {
      return;
    } 

    const connection = new SariskaMediaTransport.JitsiConnection(token, spaceTitle);
    connection.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED, () => {
      dispatch(addConnection(connection));
      createConference(connection);
    });

    connection.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_FAILED, (error) => {
      if (error === SariskaMediaTransport.errors.connection.CONNECTION_DROPPED_ERROR) {
        dispatch(setDisconnected(true));
      }
    });
    connection.addEventListener(SariskaMediaTransport.events.connection.PASSWORD_REQUIRED, () => {
      connection.setToken(token); // token expired, set a new token
    });
    connection.connect();
    dispatch(addSpaceTitle(spaceTitle));
    if (spaceType !== undefined) {
      dispatch(addSpaceType(spaceType));
    }
  };

  const createConference = async (connection) => {
    
    const conference = connection.initJitsiConference();

    if (userRole !== USER_ROLE.LISTENER) {
      conference.addTrack(audioTrack);
    }

    conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, () => {
      setLoading(false);
      dispatch(addConference(conference));
      const _properties = {};

      if (!queryParams.spaceId) {
        _properties["subRole"] = USER_ROLE.HOST;
        conference.setLocalParticipantProperty("subRole", USER_ROLE.HOST);
        dispatch(addSubRole(USER_ROLE.HOST));
      } else {
        _properties["subRole"] = userRole;
        conference.setLocalParticipantProperty( "subRole", userRole);
        dispatch(addSubRole(userRole));
      }
      dispatch(addParticipant({_identity: { user: conference.getLocalUser() }, _id: conference.myUserId(), _properties }));
      history.push(`/${spaceTitle}?spacetype=${spaceType}&role=${userRole}`);
    });

    conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_ERROR, () => {
      setLoading(false);
    });

    conference.addEventListener(SariskaMediaTransport.events.conference.USER_JOINED, (id, participant) => {
      dispatch(addThumbnailColor({ participantId: id, color: getRandomColor() }));
      if (!participant._hidden) {
        dispatch(addParticipant(participant));
      }
    });

    conference.addEventListener(SariskaMediaTransport.events.conference.USER_ROLE_CHANGED, (id) => {
      if (conference.isModerator()) {
          conference.enableLobby();
      }
  });

    conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_FAILED, async (error) => {
      if (error === SariskaMediaTransport.errors.conference.MEMBERS_ONLY_ERROR) {
        setButtonText("Asking to join");
        conference.joinLobby(name);
      }

      if (error === SariskaMediaTransport.errors.conference.CONFERENCE_ACCESS_DENIED) {
        setAccessDenied(true);
        setButtonText("Join Stage");
        setLoading(false);
        setTimeout(() => setAccessDenied(false), 2000);
      }
    });
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
      setButtonText("Join Stage");
      setSpaceTitle(queryParams.spaceId);
    }
    setName(profile?.name);
  }, [profile]);


  const handleClose = () => {
    history.push('/');
  }

  return (
    <ContentBox>
      <CloseOnlyDialogueHeader handleLeave={handleClose} closeTitle="Don't Create a Stage" />
      <StyledBox>
        <Stack>
          <YourSpace variant="h5">Your Stage</YourSpace>
          <Typography variant="subtitle2" sx={{ textAlign: "center", py: 2 }}>
            As Stages are Public, anyone can join your Stage
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
            <StyledTextField
              id="filled-number-1"
              label="Your Name"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              value={name}
              onChange={handleNameChange}
              sx={{ color: "red !important" }}
            />
            <StyledTextField
              id="filled-number"
              label="Name Your Stage"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              value={spaceTitle}
              onChange={handleSpaceChange}
              sx={{ color: "red !important" }}
            />
          </Box>
          {userRole !== USER_ROLE.LISTENER && (<AudioBox>
            {audioTrack?.isMuted() ? (
              <Tooltip title="Unmute Audio" arrow>
                <DisableMicOffOutlinedIcon onClick={unmuteAudioLocalTrack} />
              </Tooltip>
            ) : (
              <Tooltip title="Mute Audio" arrow>
                <MicNoneOutlinedIcon onClick={muteAudioLocalTrack} />
              </Tooltip>
            )}
          </AudioBox>)}
          {userRole === USER_ROLE.LISTENER && (<AudioBox>
              <Tooltip title="Listeners are muted" arrow>
                <DisableMicOffOutlinedIcon />
              </Tooltip>
          </AudioBox>)}
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
          {loading && <CircularProgress size={24} sx={{ color: color.primary, marginTop: '-60px', marginLeft: '100px' }} />}
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
