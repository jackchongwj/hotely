import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, Box, ButtonGroup } from '@mui/material';

export default function DeleteConfirmationDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleConfirmation = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Are you sure you want to delete this item ?</DialogTitle>
        <Box sx={{display: 'flex','& > *': {m: 1,},}}>
                <ButtonGroup
                    orientation="horizontal"
                    aria-label="horizontal outlined button group">
                    <Button onClick={() => handleConfirmation(selectedValue)}>Yes</Button>
                </ButtonGroup>
                <ButtonGroup 
                    orientation="horizontal"
                    aria-label="horizontal outlined button group">
                <Button onClick={() => handleClose()}>Cancel</Button>
            </ButtonGroup>
        </Box>
    </Dialog>
  );
}