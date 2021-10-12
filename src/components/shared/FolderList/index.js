import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { color } from '../../../assets/colors';

const StyledListItemText = styled(ListItemText)(({theme})=>({
    "&>span": {
        fontSize: '0.9rem',
        fontWeight: 600
    },
    "&>p":{
        fontSize: '0.8rem'
    }
}))

export default function FolderList({data, background}) {
  return (
    <List sx={{ width: '100%', maxWidth: 360}, !background ? {bgcolor: 'background.paper'}: {bgcolor: 'none'}}>
        {data.map((item, index)=>(
      <ListItem key={index}>
        <ListItemAvatar>
          <Avatar sx={{color: color.yellow, background: 'none', border: `1px solid ${color.yellow}`}}>
            {item.icon}
          </Avatar>
        </ListItemAvatar>
        <StyledListItemText primary={item.primary} secondary={item.secondary} />
      </ListItem>
      ))}
    </List>
  );
}
