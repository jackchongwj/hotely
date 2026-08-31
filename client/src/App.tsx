import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './components/auth/Login';
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
import RoomTypes from './components/rooms/RoomTypes';
import UserManagement from './components/settings/UserManagement';
import WalkIn from './components/booking/WalkIn';
import RoomMatrix from './components/rooms/RoomMatrix';
import ActivityLog from './components/staff/ActivityLog';
import Announcements from './components/staff/Announcements';
import ShiftManagement from './components/staff/ShiftManagement';
import HotelSettings from './components/settings/HotelSettings';
import MaintenancePage from './components/maintenance/MaintenancePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardLayout><Overview /></DashboardLayout></ProtectedRoute>
      } />

      <Route path="/booking/reservations" element={
        <ProtectedRoute><DashboardLayout><ReservationList /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/booking/new" element={
        <ProtectedRoute><DashboardLayout><BookingForm /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/booking/availability" element={<Navigate to="/rooms/availability" replace />} />

      <Route path="/rooms/matrix" element={
        <ProtectedRoute><DashboardLayout><RoomMatrix /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/rooms/availability" element={
        <ProtectedRoute><DashboardLayout><RoomAvailability /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/rooms/management" element={
        <ProtectedRoute><DashboardLayout><RoomManagement /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/rooms/housekeeping" element={
        <ProtectedRoute><DashboardLayout><Housekeeping /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/rooms/inventory" element={
        <ProtectedRoute><DashboardLayout><Inventory /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/rooms/maintenance" element={
        <ProtectedRoute><DashboardLayout><MaintenancePage /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/rooms" element={<Navigate to="/rooms/management" replace />} />
      <Route path="/housekeeping" element={<Navigate to="/rooms/housekeeping" replace />} />

      <Route path="/guests/check-in-out" element={
        <ProtectedRoute><DashboardLayout><CheckInOut /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/guests/management" element={
        <ProtectedRoute><DashboardLayout><GuestManagement /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/guests" element={<Navigate to="/guests/management" replace />} />
      <Route path="/check-in-out" element={<Navigate to="/guests/check-in-out" replace />} />

      <Route path="/finance/billing" element={
        <ProtectedRoute><DashboardLayout><BillingSystem /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/finance/reports" element={
        <ProtectedRoute><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/billing" element={<Navigate to="/finance/billing" replace />} />
      <Route path="/reports" element={<Navigate to="/finance/reports" replace />} />

      <Route path="/booking/calendar" element={<Navigate to="/booking/reservations" replace />} />
      <Route path="/booking/walk-in" element={
        <ProtectedRoute><DashboardLayout><WalkIn /></DashboardLayout></ProtectedRoute>
      } />

      <Route path="/rooms/types" element={
        <ProtectedRoute><DashboardLayout><RoomTypes /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/settings/users" element={
        <ProtectedRoute><DashboardLayout><UserManagement /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/settings/hotel" element={
        <ProtectedRoute><DashboardLayout><HotelSettings /></DashboardLayout></ProtectedRoute>
      } />

      <Route path="/staff/activity-log" element={
        <ProtectedRoute><DashboardLayout><ActivityLog /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/staff/announcements" element={
        <ProtectedRoute><DashboardLayout><Announcements /></DashboardLayout></ProtectedRoute>
      } />
      <Route path="/staff/shifts" element={
        <ProtectedRoute><DashboardLayout><ShiftManagement /></DashboardLayout></ProtectedRoute>
      } />
    </Routes>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
