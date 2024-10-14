import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { UserProvider } from "./context/userContext";
import { useAuth, AuthProvider } from "context/authContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";

import Layout from "components/Layout/Layout";
import Dashboard from "components/Dashboard/Dashboard";
import ReservationList from "components/Reservation/ReservationList";
import RoomRack from "components/RoomRack/RoomRack";
import Guests from "components/Guests/Guests";
import Inventory from "components/Inventory/Inventory";
import Chat from "components/Chat/Chat";
import RoomSettings from "components/RoomSettings/RoomSettings";
import Login from "components/Auth/Login";
import Register from "components/Auth/Register";
import Housekeeping from "components/Housekeeping/Housekeeping";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    
      <UserProvider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/reservation-list" element={<ProtectedRoute><ReservationList /></ProtectedRoute>} />
                  <Route path="/room-rack" element={<ProtectedRoute><RoomRack /></ProtectedRoute>} />
                  <Route path="/housekeeping" element={<ProtectedRoute><Housekeeping /></ProtectedRoute>} />
                  <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
                  <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                  <Route path="/room-settings" element={<ProtectedRoute><RoomSettings /></ProtectedRoute>} />
                </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </UserProvider>
  );
}

export default App;
