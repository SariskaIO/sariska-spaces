import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

export default function ContextMenu({contextMenu, handleContextMenu, handleClose, list}) {

  return (
    <div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {list.map((item, index)=>(
          <MenuItem onClick={()=>handleClose(item.title)} key={index}>{item.title}</MenuItem>
        ))}
      </Menu>
    </div>
  );
}

// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

// export default function StandardMenu({anchorEl, handleClick, handleClose, list}) {
//   const open = Boolean(anchorEl);

//   return (
//     <div>
//       <Menu
//         id="basic-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           'aria-labelledby': 'basic-button',
//         }}
//       >
//         {list.map((item, index)=>(
//           <MenuItem onClick={handleClose} key={index}>{item.title}</MenuItem>
//         ))}
//       </Menu>
//     </div>
//   );
// }
