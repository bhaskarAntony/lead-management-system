import React, { useState } from 'react';
import { Save, Bell, MessageSquare, Trash2 } from 'lucide-react';

function Settings() {
  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem('leadManagerSettings') || JSON.stringify({
      notifications: {
        email: true,
        desktop: true,
        followupReminders: true
      },
      templates: {
        followup: "Hi {name}, Thank you for your interest in our {course} course. When would be a good time to discuss further details?",
        demo: "Hi {name}, Your demo session for {course} has been scheduled for {date}. Looking forward to meeting you!",
        reminder: "Hi {name}, Just following up on your interest in our {course} course. Would you like to schedule a demo?"
      },
      autoFollowup: {
        enabled: true,
        daysAfter: 3
      }
    }));
  });

  const saveSettings = () => {
    localStorage.setItem('leadManagerSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all lead data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Settings</h1>

      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: e.target.checked }
                })}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Email Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.desktop}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, desktop: e.target.checked }
                })}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Desktop Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.followupReminders}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, followupReminders: e.target.checked }
                })}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Follow-up Reminders</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Message Templates</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Template
              </label>
              <textarea
                value={settings.templates.followup}
                onChange={(e) => setSettings({
                  ...settings,
                  templates: { ...settings.templates, followup: e.target.value }
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demo Confirmation Template
              </label>
              <textarea
                value={settings.templates.demo}
                onChange={(e) => setSettings({
                  ...settings,
                  templates: { ...settings.templates, demo: e.target.value }
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Template
              </label>
              <textarea
                value={settings.templates.reminder}
                onChange={(e) => setSettings({
                  ...settings,
                  templates: { ...settings.templates, reminder: e.target.value }
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Auto Follow-up</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoFollowup.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  autoFollowup: { ...settings.autoFollowup, enabled: e.target.checked }
                })}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Enable Automatic Follow-ups</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days before follow-up
              </label>
              <input
                type="number"
                value={settings.autoFollowup.daysAfter}
                onChange={(e) => setSettings({
                  ...settings,
                  autoFollowup: { ...settings.autoFollowup, daysAfter: parseInt(e.target.value) }
                })}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={saveSettings}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
          
          <button
            onClick={clearAllData}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;