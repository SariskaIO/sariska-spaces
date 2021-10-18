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

export default function RequestToSpeak({allow, deny, requestToSpeak}) {
    return (
        <Root>
            <Card>
                <div>{requestToSpeak.participantName} wants to speak</div>
                <Controls>
                    <Button onClick={deny}>Deny</Button>
                    <Button onClick={allow}>Allow</Button>
                </Controls>
            </Card>
        </Root>
    );
}
