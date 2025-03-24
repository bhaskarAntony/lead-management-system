import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Settings, LayoutDashboard, LineChart, Users, Clock, 
  LogOut, Bell, Menu, X, Search, RefreshCw 
} from 'lucide-react';
import useAuthStore from '../store/authStore';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, message: "New lead assigned", time: "5 minutes ago" },
    { id: 2, message: "Follow-up reminder: John Doe", time: "1 hour ago" },
    { id: 3, message: "Demo scheduled for tomorrow", time: "2 hours ago" },
  ];

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className=" px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <Link to="/" className="flex items-center space-x-2 ml-64">
              <LayoutDashboard className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl hidden md:inline">Lead Manager</span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl px-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-400 hover:text-gray-500 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className="px-4 py-2 hover:bg-gray-50"
                    >
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden md:inline">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-indigo-900">
          <div className="pt-16 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-base font-medium text-white hover:bg-indigo-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/recent"
              className="block px-4 py-3 text-base font-medium text-white hover:bg-indigo-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recent Leads
            </Link>
            <Link
              to="/leads"
              className="block px-4 py-3 text-base font-medium text-white hover:bg-indigo-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Leads
            </Link>
            <Link
              to="/analytics"
              className="block px-4 py-3 text-base font-medium text-white hover:bg-indigo-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-3 text-base font-medium text-white hover:bg-indigo-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;