import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { themeSettings } from 'theme'

import Layout from 'components/Layout/Layout'
import Dashboard from 'components/Dashboard/Dashboard'
import ReservationList from 'components/Reservation/ReservationList'
import RoomRack from 'components/RoomRack/RoomRack'
import Guests from 'components/Guests/Guests'
import Inventory from 'components/Inventory/Inventory'
import Chat from 'components/Chat/Chat'
import Login from 'components/Auth/Login'
import Register from 'components/Auth/Register'

function App() {
  const mode = useSelector((state) => state.global.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const token = localStorage.getItem('token')
  console.log(token)
  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route element={<Layout />}>
              <Route
                path='/'
                element={
                  token === 'null' ? (
                    <Navigate to='/login' replace />
                  ) : (
                    <Navigate to='/dashboard' replace />
                  )
                }
              />
              <Route
                path='/dashboard'
                element={
                  token === 'null' ? (
                    <Navigate to='/login' replace />
                  ) : (
                    <Dashboard />
                  )
                }
              />
              <Route
                path='/reservation-list'
                element={
                  token === 'null' ? (
                    <Navigate to='/login' replace />
                  ) : (
                    <ReservationList />
                  )
                }
              />
              <Route
                path='/room-rack'
                element={
                  token === 'null' ? (
                    <Navigate to='/login' replace />
                  ) : (
                    <RoomRack />
                  )
                }
              />
              <Route
                path='/guests'
                element={
                  token === 'null' ? (
                    <Navigate to='/login' replace />
                  ) : (
                    <Guests />
                  )
                }
              />
              <Route
                path='/inventory'
                element={
                  token === 'null' ? (
                    <Navigate to='/login' replace />
                  ) : (
                    <Inventory />
                  )
                }
              />
              {/* <Route
                path='/chat'
                element={
                  token === 'null' ? (
                    <Navigate to='/login' replace />
                  ) : (
                    <Chat />
                  )
                }
              /> */}
              
            </Route>
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App