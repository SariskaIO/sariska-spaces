import * as React from 'react';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, ListItemIcon, ListItemText } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SmsIcon from '@mui/icons-material/Sms';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyLink from '../CopyLink';
import { useHistory } from 'react-router-dom';
import { useSelector } from "react-redux";
import { USER_ROLE } from '../../../constants';


const StyledListItemText = styled(ListItemText)(() => ({
  fontSize: '0.9rem'
}))
const HiddenBox = styled(Box)(() => ({
  display: 'none'
}))

export default function SettingsMenu({ anchorEl, open, setAnchorEl }) {
  const [copySuccessCoHost, setCopySuccessCoHost] = React.useState('Copy to Invite Co-host');
  const [copySuccessSpeaker, setCopySuccessSpeaker] = React.useState('Copy to Invite Speaker');
  const [copySuccessListener, setCopySuccessListener] = React.useState('Copy to Listener');
  const profile = useSelector(state => state.profile);


  const history = useHistory();

  const handleTweet = () => {
    if (profile.subRole === USER_ROLE.HOST || profile.subRole === USER_ROLE.CO_HOST) {
      window.open('https://twitter.com/compose/tweet', '_blank');
    }
    setAnchorEl(null)
  }

  const handleDM = () => {
    if (profile.subRole === USER_ROLE.HOST || profile.subRole === USER_ROLE.CO_HOST) {
      window.open('https://twitter.com/messages', '_blank');
    }
    setAnchorEl(null)
  }

  function copyText(role, text) {
    navigator.clipboard.writeText(text);

    if (role === USER_ROLE.CO_HOST) {
      setCopySuccessCoHost('Copy CoHost Again');
    }

    if (role === USER_ROLE.SPEAKER) {
      setCopySuccessSpeaker('Copy Speaker Again');
    }

    if (role === USER_ROLE.LISTENER) {
      setCopySuccessListener('Copy Listener Again');
    }

  }


  const handleClose = () => {
    setAnchorEl(null);
    setCopySuccessCoHost("Copy to Invite Co-host");
    setCopySuccessSpeaker("Copy to Invite Speaker");
    setCopySuccessListener("Copy to Listener");
  }

  const inviteMenu = () => {
    history.push('/invite');
  }

  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleTweet} disabled={(profile.subRole === USER_ROLE.SPEAKER || profile.subRole  === USER_ROLE.LISTENER)}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>Koo</StyledListItemText>
        </MenuItem>

        <MenuItem onClick={handleDM} disabled={(profile.subRole === USER_ROLE.SPEAKER || profile.subRole ===  USER_ROLE.LISTENER)}>
          <ListItemIcon>
            <SmsIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>Direct Message</StyledListItemText>
        </MenuItem>

        <MenuItem onClick={()=>copyText(USER_ROLE.CO_HOST, `${window.location.origin}${window.location.pathname}?spacetype=${profile.spaceType}&role=${USER_ROLE.CO_HOST}`)}  disabled={(profile.subRole === USER_ROLE.CO_HOST || profile.subRole === USER_ROLE.SPEAKER || profile.subRole === USER_ROLE.LISTENER)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>{copySuccessCoHost}</StyledListItemText>
          <HiddenBox>
            <CopyLink textToCopy={`${window.location.origin}${window.location.pathname}?spacetype=${profile.spaceType}&role=${USER_ROLE.CO_HOST}`} />
          </HiddenBox>
        </MenuItem>

        <MenuItem onClick={()=>copyText(USER_ROLE.SPEAKER, `${window.location.origin}${window.location.pathname}?spacetype=${profile.spaceType}&role=${USER_ROLE.SPEAKER}`)} disabled={(profile.subRole === USER_ROLE.SPEAKER || profile.subRole === USER_ROLE.LISTENER)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>{copySuccessSpeaker}</StyledListItemText>
          <HiddenBox>
            <CopyLink textToCopy={`${window.location.origin}${window.location.pathname}?spacetype=${profile.spaceType}&role=${USER_ROLE.SPEAKER}`} />
          </HiddenBox>
        </MenuItem>

        <MenuItem onClick={()=>copyText(USER_ROLE.LISTENER, `${window.location.origin}${window.location.pathname}?spacetype=${profile.spaceType}&role=${USER_ROLE.LISTENER}`)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>{copySuccessListener}</StyledListItemText>
          <HiddenBox>
            <CopyLink textToCopy={`${window.location.origin}${window.location.pathname}?spacetype=${profile.spaceType}&role=${USER_ROLE.LISTENER}`}  />
          </HiddenBox>
        </MenuItem>

      </Menu>
    </div>
  );
}
