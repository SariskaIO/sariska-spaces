import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

export default function SelectMenu({nameId, setNameId, handleChange, list}) {
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
        <Select
          labelId="demo-controlled-open-select-label"
          id={nameId}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={nameId}
          label="Your Name"
          onChange={handleChange}
          placeholder="Pick Your Name"
        >
            <MenuItem value="">Pick Your Name</MenuItem>
          {list.map((item, index) => (
              <MenuItem value={item.id}>{item.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
