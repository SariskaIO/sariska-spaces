import * as React from 'react';
import {styled} from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, ListItemIcon, ListItemText } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SmsIcon from '@mui/icons-material/Sms';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyLink from '../CopyLink';
import { useHistory } from 'react-router-dom';


const StyledListItemText = styled(ListItemText)(()=>({
  fontSize: '0.9rem'
}))
const HiddenBox = styled(Box)(()=>({
  display: 'none'
}))

export default function SettingsMenu({anchorEl, open, setAnchorEl}) {
  const [copySuccessCoHost, setCopySuccessCoHost] = React.useState('Copy to Invite Co-host');
  const [copySuccessSpeaker, setCopySuccessSpeaker] = React.useState('Copy to Invite Speaker');
  const [copySuccessListener, setCopySuccessListener] = React.useState('Copy to Listener');
  
  let urlSearchParams = new URLSearchParams(window.location.search);
  let privateSearchParams = Object.fromEntries(urlSearchParams?.entries())?.private;
  let role = Object.fromEntries(urlSearchParams?.entries())?.role;

  const textToCopyCoHost = window.location.origin+window.location.pathname+`?private=${privateSearchParams}&role=cohost`;
  const textToCopySpeaker = window.location.origin+window.location.pathname+`?private=${privateSearchParams}&role=speaker`;
  const textToCopyListener = window.location.origin+window.location.pathname+`?private=${privateSearchParams}&role=listener`;

  const history = useHistory();

  const handleTweet = () => {
    if(role === "host" || role==="cohost"){
      window.open('https://www.kooapp.com/create', '_blank');
    }
    setAnchorEl(null)
  }
  const handleDM = () => {
    if(role === "host" || role==="cohost"){
    window.open('https://www.kooapp.com/create', '_blank');
    }
    setAnchorEl(null)
  }
  function copyCoHostToClipboard() {
    if(role === "host"){
    navigator.clipboard.writeText(textToCopyCoHost);
    setCopySuccessCoHost('Copy CoHost Again');
    }
  }
  function copySpeakerToClipboard() {
    if(role === "host" || role==="cohost"){
    navigator.clipboard.writeText(textToCopySpeaker);
    setCopySuccessSpeaker('Copy Speaker Again');
    }
  }
  function copyListenerToClipboard() {
    if(role === "host" || role==="cohost"){
    navigator.clipboard.writeText(textToCopyListener);
    setCopySuccessListener('Copy Listener Again');
    }
  }

  const handleClose = () => {
    setAnchorEl(null);
    setCopySuccessCoHost("Copy to Invite Co-host");
    setCopySuccessSpeaker("Copy to Invite Speaker");
    setCopySuccessListener("Copy to Listener");
  }
  const inviteMenu =() => {
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
        {/* <MenuItem onClick={inviteMenu}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>Invite</StyledListItemText>
        </MenuItem> */}
        <MenuItem onClick={handleTweet} disabled={(role === "speaker" || role === "listener") && "true"}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>Koo</StyledListItemText>
        </MenuItem>

        <MenuItem onClick={handleDM} disabled={(role === "speaker" || role === "listener") && "true"}>
          <ListItemIcon>
            <SmsIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>Direct Message</StyledListItemText>
        </MenuItem>
        <MenuItem onClick={copyCoHostToClipboard} disabled={(role === "cohost" || role === "speaker" || role === "listener")}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>{copySuccessCoHost}</StyledListItemText>
          <HiddenBox>
            <CopyLink copySuccess={copySuccessCoHost} setCopySuccess={setCopySuccessCoHost} textToCopy={textToCopyCoHost} onClick={copyCoHostToClipboard}/>
          </HiddenBox>
        </MenuItem>
        <MenuItem onClick={copySpeakerToClipboard} disabled={(role === "speaker" || role === "listener")}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>{copySuccessSpeaker}</StyledListItemText>
          <HiddenBox>
            <CopyLink copySuccess={copySuccessSpeaker} setCopySuccess={setCopySuccessSpeaker} textToCopy={textToCopySpeaker} onClick={copySpeakerToClipboard}/>
          </HiddenBox>
        </MenuItem>
        <MenuItem onClick={copyListenerToClipboard}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>{copySuccessListener}</StyledListItemText>
          <HiddenBox>
            <CopyLink copySuccess={copySuccessListener} setCopySuccess={setCopySuccessListener} textToCopy={textToCopyListener} onClick={copyListenerToClipboard}/>
          </HiddenBox>
        </MenuItem>
      </Menu>
    </div>
  );
}
