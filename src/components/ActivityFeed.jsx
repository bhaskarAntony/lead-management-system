import React from 'react';
import { format } from 'date-fns';
import { Activity, User, Phone, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import useActivityStore from '../store/activityStore';

const getActivityIcon = (type) => {
  switch (type) {
    case 'status_update': return CheckCircle;
    case 'counselor_assigned': return User;
    case 'follow_up': return Phone;
    case 'demo_scheduled': return Calendar;
    default: return Activity;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'status_update': return 'text-green-500';
    case 'counselor_assigned': return 'text-blue-500';
    case 'follow_up': return 'text-orange-500';
    case 'demo_scheduled': return 'text-purple-500';
    default: return 'text-gray-500';
  }
};

function ActivityFeed() {
  const activities = useActivityStore(state => state.activities);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-indigo-600" />
        Recent Activities
      </h2>

      <div className="space-y-4">
        {activities.slice(-10).reverse().map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          const iconColor = getActivityColor(activity.type);

          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${iconColor}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No recent activities
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;