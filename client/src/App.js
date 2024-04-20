import React, { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { UserProvider } from './state/userContext'; // Ensure this path is correct
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { themeSettings } from 'theme';

import Layout from 'components/Layout/Layout';
import Dashboard from 'components/Dashboard/Dashboard';
import ReservationList from 'components/Reservation/ReservationList';
import RoomRack from 'components/RoomRack/RoomRack';
import Guests from 'components/Guests/Guests';
import Inventory from 'components/Inventory/Inventory';
import Chat from 'components/Chat/Chat';
import Login from 'components/Auth/Login';
import Register from 'components/Auth/Register';

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <UserProvider> {/* Wrap the routing and theme provider within UserProvider */}
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route element={<Layout />}>
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/reservation-list' element={<ReservationList />} />
              <Route path='/room-rack' element={<RoomRack />} />
              <Route path='/guests' element={<Guests />} />
              <Route path='/inventory' element={<Inventory />} />
              {/* Other protected routes */}
            </Route>
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
