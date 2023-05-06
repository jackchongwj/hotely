import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { themeSettings } from 'theme'

import Layout from 'components/Layout'
import Dashboard from 'pages/Dashboard'
import ReservationList from 'pages/ReservationList'
import RoomRack from 'pages/RoomRack'
import Guests from 'pages/Guests'
import Inventory from 'pages/Inventory'
import Chat from 'pages/Chat'
import Login from 'auth/Login'
import Register from 'auth/Register'

function App() {
  const mode = useSelector((state) => state.global.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const token = localStorage.getItem('token')
  console.log('token', token)
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
              <Route
                path='/chat'
                element={
                  token === 'null' ? (
                    <Navigate to='/login' replace />
                  ) : (
                    <Chat />
                  )
                }
              />
              
            </Route>
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
