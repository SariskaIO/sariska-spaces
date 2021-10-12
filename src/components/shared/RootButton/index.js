import React from 'react';
import { Fab } from '@mui/material'
import {styled} from '@mui/material/styles';
import { color } from '../../../assets/colors';



const RootButton = ({variant, size, buttonText, onClick, width, disabled}) => {
    const StyledFab = styled(Fab)(({theme})=>({
        textTransform: 'capitalize', 
        marginBottom: theme.spacing(3), 
        border: `2px solid ${color.gray}`, 
        background: color.yellow, 
        color: color.gray, 
        fontWeight: '600',
        padding: theme.spacing(1),
        width: width ? width : '150px',
        "&:hover": {
            background: color.yellow,
            opacity: '0.9'
        }
    }))
    return (
        <StyledFab variant={variant} size={size} aria-label="add" onClick={onClick} disabled={disabled}>
              {buttonText}
        </StyledFab>
    )
}

export default RootButton
