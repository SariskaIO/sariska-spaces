import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function ContextMenu({contextMenu, handleContextMenu, handleClose, list, participantId}) {

  return (
    <>{ list?.length>0 && <div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
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
        { list?.length>0 && list.map((item, index)=><MenuItem onClick={()=>handleClose(item.title, participantId)} key={index}>{item.title}</MenuItem>)}
      </Menu>
    </div>}</>
  );
}