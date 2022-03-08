import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SpeakerGroupOutlinedIcon from '@mui/icons-material/SpeakerGroupOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import { useHistory, useParams } from "react-router-dom";
import SariskaMediaTransport from "sariska-media-transport";
import { useDispatch, useSelector } from "react-redux";
import FolderList from '../../components/shared/FolderList';
import RootButton from '../../components/shared/RootButton';
import ContentBox from '../../components/shared/ContentBox';
import CloseOnlyDialogueHeader from '../../components/shared/CloseOnlyDialogueHeader';
import { addLocalTrack } from '../../store/actions/track';
import {USER_ROLE} from "../../constants"

const StyledBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2)
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: '900',
  paddingBottom: theme.spacing(1),
  textAlign: 'center',
  width: '90%'
}))

const SpaceTerms = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const queryParams = useParams();
  const profile = useSelector(state=>state.profile);
  const urlSearchParams = new URLSearchParams(window.location.search);
  let spaceType = Object.fromEntries(urlSearchParams?.entries())?.spacetype;
  let userRole = Object.fromEntries(urlSearchParams?.entries())?.role || profile.subRole;

  const options = {
    devices: ["audio"],
  };


  const createNewLocalTracks = async () => {
    const newLocalTracks = await SariskaMediaTransport?.createLocalTracks(options);
    newLocalTracks?.forEach((track) => dispatch(addLocalTrack(track)));
  };

  const handleTerms = () => {
    if (userRole !== USER_ROLE.LISTENER) {
       createNewLocalTracks();
    }

    if (queryParams.spaceId && userRole !== undefined && spaceType  !== undefined) {
      history.push(`/start/${queryParams.spaceId}?spacetype=${spaceType}&role=${userRole}`);
    } else if ( queryParams.spaceId ) {
      history.push(`/start/${queryParams.spaceId}?spacetype=${spaceType}&role=${userRole}`);
    } else {
      history.push("/start");
    }
  }

  const handleClose = () => {
    history.push('/');
  }

  const data = [
    { icon: <PublicOutlinedIcon />, primary: 'Public Stage', secondary: 'Only Blocked Account can not join' },
    { icon: <SpeakerGroupOutlinedIcon />, primary: 'Add Unlimited Speakers', secondary: 'Invite as many Speakers as you wish' },
    { icon: <RuleOutlinedIcon />, primary: 'Personalise Your Stage', secondary: 'Mute any Speaker or remove any guest' },
  ]

  return (
    <ContentBox>
      <CloseOnlyDialogueHeader handleLeave={handleClose} closeTitle="Close Terms" />
      <StyledBox>
        <Stack>
          <StyledTypography variant="h6">Set up Live Audio Conversations with Stage </StyledTypography>
          <Stack>
            <FolderList data={data} background="true" />
          </Stack>
          <Box sx={{ pt: 3 }}>
            <RootButton variant="extended" size="large" buttonText="Let's Start" onClick={handleTerms} width="100%" />
          </Box>
        </Stack>
      </StyledBox>
    </ContentBox>
  )
}

export default SpaceTerms
