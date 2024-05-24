import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDown,
} from "@mui/icons-material";
import FlexBetween from "components/Layout/FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import axios from "axios";
import { useAuth } from "context/authContext";
import { useUser } from "context/userContext";
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { setIsAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const { user } = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isRoomSettingsDialogOpen, setIsRoomSettingsDialogOpen] = useState(false);

  const isOpen = Boolean(anchorEl);
  const isOpen1 = Boolean(anchorEl1);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const handleClick1 = (event) => setAnchorEl1(event.currentTarget);
  const handleClose1 = () => setAnchorEl1(null);
  
  const handleLogout = async () => {
    try {
      // The endpoint should clear the cookies
      await axios.post('http://localhost:5001/auth/logout');
      navigate('/login', { replace: true });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleOpenProfileDialog = () => setIsProfileDialogOpen(true);
  const handleCloseProfileDialog = () => setIsProfileDialogOpen(false);

  const handleNavigateToRoomSettings = () => {
    navigate('/room-settings');
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>

        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <FlexBetween>
            <IconButton onClick={handleClick1}>
              <SettingsOutlined sx={{ fontSize: "25px" }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl1}
              open={isOpen1}
              onClose={handleClose1}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleOpenProfileDialog}>View Profile</MenuItem>
              <MenuItem onClick={handleClose}>All Users</MenuItem>
              {user && user.role === "Administrator" && (
                <MenuItem onClick={handleNavigateToRoomSettings}>Room Settings</MenuItem>
              )}
            </Menu>
          </FlexBetween>
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >

              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {`${user.fname} ${user.lname}`}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <ArrowDropDown
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>

      {/* Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onClose={handleCloseProfileDialog}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          {/* Add profile content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>

    </AppBar>
  );
};

export default Topbar;
