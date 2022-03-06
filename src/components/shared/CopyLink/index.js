import React from 'react';
import {styled} from '@mui/material/styles';
import { Box, Grid, TextField, Button, Typography} from '@mui/material';
import { color } from '../../../assets/colors';

const Root = styled(Grid)(({theme})=>({
    padding: theme.spacing(1, 0),
}))

const GridItem = styled(Grid)(({theme})=>({
    margin: theme.spacing(3, 0),
}))

const StyledTextField = styled(TextField)(({theme})=>({
    color: 'red',
        "& .MuiFormLabel-root.Mui-focused": {
            color: color.secondary
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":{
            borderColor: `${color.secondary}`
          },
        "& input": {
            fontSize: '0.85rem'
        }
}))

// const StyledIcon = styled(Grid)(({theme})=>({
//     background: `${color.yellow}`
// }))

const StyledButton = styled(Button)(({theme})=>({
    color: `${color.primary}`, 
    borderColor: `${color.primary}`, 
    borderRadius: '15px',
    width: '100%',
    marginTop: '32px'
}))

const CopyLink = ({copySuccess, textToCopy, onClick, role}) => {

    return (
        <Root container item alignItems="center" >
            <Grid item xs={12} >
                <form>
                    <StyledTextField id="input-with-icon-grid"
                       label="Generated Link"
                       value={textToCopy}
                       variant="outlined"
                       fullWidth
                    />
                </form>
            </Grid>
            <GridItem item xs={12} >
                <Box>
                    <StyledButton variant="outlined" onClick={()=>onClick(role, textToCopy)}>{copySuccess ? 'Copy Again' : 'Copy'}</StyledButton>
                    <Typography variant="subtitle2" style={{
                        color: `${color.primary}`,
                        borderColor: `${color.primary}`
                    }}>{copySuccess}</Typography>
                </Box>
            </GridItem>
        </Root>
    )
}

export default CopyLink

