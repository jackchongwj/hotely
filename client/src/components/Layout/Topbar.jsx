import React, { useState, useEffect } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  SettingsOutlined,
  ArrowDropDown,
} from "@mui/icons-material";
import FlexBetween from "components/Layout/FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useAuth } from "context/authContext";
import { useUser } from "context/userContext";
import { setMode } from "state";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
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
  const mode = useSelector((state) => state.global.mode); // Access mode from redux
  const { user } = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const isOpen = Boolean(anchorEl);
  const isOpen1 = Boolean(anchorEl1);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClick1 = (event) => setAnchorEl1(event.currentTarget);
  const handleClose1 = () => setAnchorEl1(null);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5001/auth/logout");
      navigate("/login", { replace: true });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleOpenProfileDialog = () => setIsProfileDialogOpen(true);
  const handleCloseProfileDialog = () => setIsProfileDialogOpen(false);

  // Save theme mode in local storage and toggle
  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    dispatch(setMode(newMode)); // Update Redux state
    localStorage.setItem("themeMode", newMode); // Persist theme in localStorage
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
            <MenuIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={toggleTheme}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined
                sx={{ fontSize: "25px", color: theme.palette.text.primary }}
              />
            ) : (
              <LightModeOutlined
                sx={{ fontSize: "25px", color: theme.palette.text.primary }}
              />
            )}
          </IconButton>

          <FlexBetween>
            <IconButton onClick={handleClick1}>
              <SettingsOutlined
                sx={{ fontSize: "25px", color: theme.palette.text.primary }}
              />
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
                <MenuItem onClick={() => navigate("/room-settings")}>
                  Room Settings
                </MenuItem>
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
                gap: "0.5rem",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                fontSize: "14px",
                fontWeight: "bold",
                padding: "5px 10px",
              }}
            >
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {`${user.fname} ${user.lname}`}
                </Typography>
              </Box>
              <ArrowDropDown
                sx={{ color: theme.palette.text.secondary, fontSize: "25px" }}
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
        <DialogContent>{/* Add profile content here */}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Topbar;
