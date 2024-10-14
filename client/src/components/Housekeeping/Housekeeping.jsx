import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import RoomStatus from './RoomStatus';
import Schedule from './Schedule';
import Tasks from './Tasks';

const HousekeepingPage = () => {
  const [openDialog, setOpenDialog] = useState({ roomStatus: false, schedule: false, tasks: false });

  const handleOpenDialog = (type) => {
    setOpenDialog({ ...openDialog, [type]: true });
  };

  const handleCloseDialog = () => {
    setOpenDialog({ roomStatus: false, schedule: false, tasks: false });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginBottom: '1rem' }}>
        Housekeeping Management
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog('roomStatus')}>
          Room Status
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog('schedule')}>
          Schedule
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog('tasks')}>
          Tasks
        </Button>
      </Box>
      <Dialog open={openDialog.roomStatus} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogContent>
          <RoomStatus />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog.schedule} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogContent>
          <Schedule />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog.tasks} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogContent>
          <Tasks />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HousekeepingPage;
