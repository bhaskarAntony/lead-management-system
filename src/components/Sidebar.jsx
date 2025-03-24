import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Clock, LineChart, Settings,
  RefreshCw, Filter, ChevronRight, Bell, Activity
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import useAuthStore from '../store/authStore';

function NavLink({ to, icon: Icon, children, notification }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={twMerge(
        "flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors",
        isActive 
          ? "bg-indigo-500 text-white" 
          : "text-gray-300 hover:bg-indigo-600/50 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{children}</span>
      {notification && (
        <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {notification}
        </span>
      )}
    </Link>
  );
}

function Sidebar() {
  const user = useAuthStore(state => state.user);
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  const todayLeads = leads.filter(lead => 
    new Date(lead.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const refreshLeads = () => {
    // Implement lead refresh logic
    window.location.reload();
  };

  return (
    <div className="hidden lg:flex flex-col h-screen bg-indigo-900 w-64 fixed left-0 top-0 bottom-0 pt-16">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="space-y-1 px-3 py-4">
          <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
          <NavLink to="/recent" icon={Clock} notification={todayLeads}>
            Recent Leads
          </NavLink>
          <NavLink to="/leads" icon={Users}>All Leads</NavLink>
          <NavLink to="/analytics" icon={LineChart}>Analytics</NavLink>
          <NavLink to="/activity" icon={Activity}>Recent Activity</NavLink>
          <NavLink to="/settings" icon={Settings}>Settings</NavLink>
        </div>

        <div className="px-3 py-4 border-t border-indigo-800">
          <h2 className="px-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <button 
              onClick={refreshLeads}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-indigo-600/50 hover:text-white rounded-lg transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh Leads</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-indigo-600/50 hover:text-white rounded-lg transition-colors">
              <Filter className="h-5 w-5" />
              <span>Filter View</span>
            </button>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-indigo-800">
          <div className="flex items-center space-x-3 px-4 py-3 bg-indigo-800 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-indigo-900 font-medium">
                  {user?.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-indigo-300 truncate">
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-indigo-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;