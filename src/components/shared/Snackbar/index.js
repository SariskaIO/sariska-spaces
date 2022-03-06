
import { Alert, Box , Snackbar} from "@mui/material";
import React, {useEffect, useState} from 'react'


const SnackbarBox = ({notification}) => {
    const  [open, setOpen] = useState({open: false});
    useEffect(()=>{
        setOpen(true);
        setTimeout(()=>setOpen(false), 2000);
    }, [notification])

    if (!notification?.message) {
        return null;
    }
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            autoHideDuration={2000}
            open={open}
        >
            <Alert severity={notification.severity}>{notification.message}</Alert>
        </Snackbar>
    )
}

export default SnackbarBox;
