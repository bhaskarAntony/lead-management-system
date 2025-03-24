import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import LeadDetails from './pages/LeadDetails';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import LeadsTable from './pages/LeadsTable';
import RecentLeads from './pages/RecentLeads';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import useAuthStore from './store/authStore';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated() && (
          <>
            <Navbar />
            <div className="flex mt-14">
              <Sidebar />
              <main className="flex-1 lg:ml-64 p-4 lg:p-8 min-h-screen overflow-x-hidden pb-20 lg:pb-8">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={
                     <Dashboard />
                    } />
                    <Route path="/lead/:id" element={
                     <LeadDetails />
                    } />
                    <Route path="/settings" element={
                      <Settings />
                    } />
                    <Route path="/analytics" element={
                       <Analytics />
                    } />
                    <Route path="/leads" element={
                      <LeadsTable />
                    } />
                    <Route path="/recent" element={
                     <RecentLeads />
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </main>
            </div>
            <MobileNav />
          </>
        )}
        {!isAuthenticated() && (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;