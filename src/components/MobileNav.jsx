import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Clock, LineChart, Settings,
  Activity, Home, PieChart
} from 'lucide-react';

function MobileNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 gap-1 p-2">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            isActive('/') ? 'text-indigo-600' : 'text-gray-600'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/recent"
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            isActive('/recent') ? 'text-indigo-600' : 'text-gray-600'
          }`}
        >
          <Clock className="h-6 w-6" />
          <span className="text-xs mt-1">Recent</span>
        </Link>

        <Link
          to="/leads"
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            isActive('/leads') ? 'text-indigo-600' : 'text-gray-600'
          }`}
        >
          <Users className="h-6 w-6" />
          <span className="text-xs mt-1">Leads</span>
        </Link>

        <Link
          to="/analytics"
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            isActive('/analytics') ? 'text-indigo-600' : 'text-gray-600'
          }`}
        >
          <PieChart className="h-6 w-6" />
          <span className="text-xs mt-1">Stats</span>
        </Link>

        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            isActive('/settings') ? 'text-indigo-600' : 'text-gray-600'
          }`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">More</span>
        </Link>
      </div>
    </nav>
  );
}

export default MobileNav;