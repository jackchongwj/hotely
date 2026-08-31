import React, { useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Header from './Header';
import { ThemeProvider } from '../context/ThemeContext';
import { SocketProvider } from '../../context/SocketContext';
import ChatWidget from '../chat/ChatWidget';
import ConfirmDialog from '../common/ConfirmDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  useDocumentTitle();

  return (
    <ThemeProvider>
      <SocketProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header onMobileMenuToggle={() => setMobileSidebarOpen(o => !o)} />
            <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 dark:text-gray-100">
              {children}
            </main>
          </div>
        </div>
        <ChatWidget />
        <ConfirmDialog />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-gray-100',
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </SocketProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
