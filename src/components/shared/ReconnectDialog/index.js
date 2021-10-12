import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { color } from '../../../assets/colors';

const Anchor = styled(Button)((theme) => ({
        color: color.secondary,
        textDecoration: "none",
        border: `1px solid ${color.primary}`,
        padding: '8px 40px',
        borderRadius: "15px",
        fontWeight: "900",
        textTransform: "capitalize",
        "&:hover": {
            color: color.primary,
        },
}));

export default function ReconnectDialog({open}) {
    const theme = useTheme();
    const history = useHistory();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        window.location.reload();
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Disconnected"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have disconnectd, Please reconnect again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Anchor onClick={handleClose} autoFocus>
                        Reconnect
                    </Anchor>
                </DialogActions>
            </Dialog>
        </div>
    );
}
