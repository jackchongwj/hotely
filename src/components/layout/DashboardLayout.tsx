import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ThemeProvider } from '../context/ThemeContext';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 dark:text-gray-100">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>);

};
export default DashboardLayout;