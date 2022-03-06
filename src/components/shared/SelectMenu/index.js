import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from "@mui/material/styles";

const StyledSelect = styled(Select)(({ theme }) => ({
  "&.MuiSelect-root.Mui-focused":{
    border: '2px solid yellow'
  }
}));

export default function SelectMenu({userId, handleChange, list}) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  return (
    <Box sx={{width: '95%'}}>
      <FormControl sx={{ m: '0 0 8px 0', minWidth: '100%' }}>
        <InputLabel id="demo-controlled-open-select-label">Select Name</InputLabel>
        <StyledSelect
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select-label"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={userId}
          label="Your Name"
          onChange={handleChange}
          placeholder="Pick Your Name"
        >
          {list.map((item, index) => (
              <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </Box>
  );
}
