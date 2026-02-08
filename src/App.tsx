import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate } from
'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './components/dashboard/Overview';
import RoomAvailability from './components/booking/RoomAvailability';
import BookingForm from './components/booking/BookingForm';
import ReservationList from './components/booking/ReservationList';
import RoomManagement from './components/rooms/RoomManagement';
import Inventory from './components/rooms/Inventory';
import GuestManagement from './components/guests/GuestManagement';
import CheckInOut from './components/guests/CheckInOut';
import BillingSystem from './components/billing/BillingSystem';
import Reports from './components/reports/Reports';
import Housekeeping from './components/housekeeping/Housekeeping';
export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
          <DashboardLayout>
              <Overview />
            </DashboardLayout>
          } />


        {/* Booking Routes */}
        <Route
          path="/booking/reservations"
          element={
          <DashboardLayout>
              <ReservationList />
            </DashboardLayout>
          } />

        <Route
          path="/booking/new"
          element={
          <DashboardLayout>
              <BookingForm />
            </DashboardLayout>
          } />

        {/* Redirect old path */}
        <Route
          path="/booking/availability"
          element={<Navigate to="/rooms/availability" replace />} />


        {/* Room Routes */}
        <Route
          path="/rooms/availability"
          element={
          <DashboardLayout>
              <RoomAvailability />
            </DashboardLayout>
          } />

        <Route
          path="/rooms/management"
          element={
          <DashboardLayout>
              <RoomManagement />
            </DashboardLayout>
          } />

        <Route
          path="/rooms/housekeeping"
          element={
          <DashboardLayout>
              <Housekeeping />
            </DashboardLayout>
          } />

        <Route
          path="/rooms/inventory"
          element={
          <DashboardLayout>
              <Inventory />
            </DashboardLayout>
          } />

        {/* Redirect old paths */}
        <Route
          path="/rooms"
          element={<Navigate to="/rooms/management" replace />} />

        <Route
          path="/housekeeping"
          element={<Navigate to="/rooms/housekeeping" replace />} />


        {/* Guest Routes */}
        <Route
          path="/guests/check-in-out"
          element={
          <DashboardLayout>
              <CheckInOut />
            </DashboardLayout>
          } />

        <Route
          path="/guests/management"
          element={
          <DashboardLayout>
              <GuestManagement />
            </DashboardLayout>
          } />

        {/* Redirect old paths */}
        <Route
          path="/guests"
          element={<Navigate to="/guests/management" replace />} />

        <Route
          path="/check-in-out"
          element={<Navigate to="/guests/check-in-out" replace />} />


        {/* Finance Routes */}
        <Route
          path="/finance/billing"
          element={
          <DashboardLayout>
              <BillingSystem />
            </DashboardLayout>
          } />

        <Route
          path="/finance/reports"
          element={
          <DashboardLayout>
              <Reports />
            </DashboardLayout>
          } />

        {/* Redirect old paths */}
        <Route
          path="/billing"
          element={<Navigate to="/finance/billing" replace />} />

        <Route
          path="/reports"
          element={<Navigate to="/finance/reports" replace />} />

      </Routes>
    </Router>);

}