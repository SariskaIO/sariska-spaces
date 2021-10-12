import { Card, Box, Button } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

const Root = styled(Box)(()=>({
    position: "absolute",
        top : 0,
        width: "400px",
        left: 0,
        right: 0,
        margin: "0 auto",
        padding: "50px",
        "& > div" : {
           padding: "20px"
        }
}));
const Controls = styled(Box)(()=>({
    textAlign: "right",
    marginTop: "20px"
}))

export default function PermissionDialog({displayName, allowLobbyAccess, denyLobbyAccess}) {

    return (
        <Root>
            <Card>
                <div>Someone wants to join {displayName}</div>
                <Controls>
                    <Button onClick={allowLobbyAccess}>Allow</Button>
                    <Button onClick={denyLobbyAccess}>Deny</Button>
                </Controls>
            </Card>
        </Root>
    );
}
