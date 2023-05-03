import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";

import Layout from "components/Layout";
import Dashboard from "pages/Dashboard";
import ReservationList from "pages/ReservationList";
import RoomRack from "pages/RoomRack";
import Guests from "pages/Guests";
import Inventory from "pages/Inventory";
import Chat from "pages/Chat";
import Login from "auth/Login";
import Register from "auth/Register";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* <Route
              exact
              path="/"
              element={isLoggedIn === "true" ? <Dashboard /> : <Login />}
            /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
            
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reservation-list" element={<ReservationList />} />
              {/* <Route path="/room-rack" element={<RoomRack />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/chat" element={<Chat />} /> */}
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;