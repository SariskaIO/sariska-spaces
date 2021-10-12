import * as React from "react";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Typography } from "@mui/material";
import {styled} from "@mui/material/styles";
import { color } from "../../../assets/colors";


const StyledFormControl = styled(FormControl)(() => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90% !important'
}))
const StyledTypography = styled(Typography)(()=>({
    fontWeight: 600,
    fontSize: '0.8rem'
}))
const SwitchTypography = styled(Typography)(({theme})=>({
    fontWeight: 600,
    fontSize: '0.8rem',
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5)
}))
const StyledFormGroup = styled(FormGroup)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}))

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#999',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : color.yellow,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#d1d1EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

export default function Switches({disabled, checked, setChecked}) {

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  console.log('swch1', checked);
  
  return (
    <StyledFormControl component="fieldset">
    <StyledTypography>Choose Space Type</StyledTypography>
      <StyledFormGroup aria-label="position">
        <SwitchTypography>Public</SwitchTypography>
            {disabled ? <IOSSwitch color="primary" checked={checked==="true" ? true : false} onChange={handleChange} disabled /> :
                        <IOSSwitch color="primary" checked={checked} onChange={handleChange} />
            }
        <SwitchTypography>Private</SwitchTypography>
      </StyledFormGroup>
    </StyledFormControl>
  );
}
