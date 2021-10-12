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

export default function SettingsMenu({anchorEl, open, handleClose, copySuccess, setCopySuccess}) {
  const textToCopy = window.location.href;
  const history = useHistory();
  const handleTweet = () => {
    window.open('https://twitter.com/compose/tweet', '_blank');
    handleClose();
  }
  const handleDM = () => {
    window.open('https://twitter.com/messages', '_blank');
    handleClose();
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess('Copy Again');
  }
  const inviteMenu =() => {
    history.push('/invite');
  }
  console.log('copya', copySuccess)
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
        <MenuItem onClick={handleTweet} >
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>Koo</StyledListItemText>
        </MenuItem>

        <MenuItem onClick={handleDM}>
          <ListItemIcon>
            <SmsIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>Direct Message</StyledListItemText>
        </MenuItem>
        <MenuItem onClick={copyToClipboard}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <StyledListItemText>{copySuccess}</StyledListItemText>
          <HiddenBox>
            <CopyLink copySuccess={copySuccess} setCopySuccess={setCopySuccess} textToCopy={textToCopy} onClick={copyToClipboard}/>
          </HiddenBox>
        </MenuItem>
      </Menu>
    </div>
  );
}
