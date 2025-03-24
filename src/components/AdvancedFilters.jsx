import React from 'react';
import { Filter, X } from 'lucide-react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import useAuthStore from '../store/authStore';

function AdvancedFilters({ filters, setFilters, onClose }) {
  const counselors = useAuthStore(state => state.counselors);
  
  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Follow Up', label: 'Follow Up' },
    { value: 'Demo Scheduled', label: 'Demo Scheduled' },
    { value: 'Demo Completed', label: 'Demo Completed' },
    { value: 'Converted', label: 'Converted' },
    { value: 'Not Interested', label: 'Not Interested' }
  ];

  const counselorOptions = [
    { value: 'superadmin', label: 'Super Admin' },
    ...counselors.map(c => ({ value: c.id, label: c.name }))
  ];

  const courseOptions = [
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <DatePicker
                    selected={filters.dateRange.from}
                    onChange={date => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, from: date }
                    })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <DatePicker
                    selected={filters.dateRange.to}
                    onChange={date => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, to: date }
                    })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                isMulti
                options={statusOptions}
                value={statusOptions.filter(option => 
                  filters.status.includes(option.value)
                )}
                onChange={selected => setFilters({
                  ...filters,
                  status: selected.map(option => option.value)
                })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Counselor
              </label>
              <Select
                isMulti
                options={counselorOptions}
                value={counselorOptions.filter(option => 
                  filters.counselors.includes(option.value)
                )}
                onChange={selected => setFilters({
                  ...filters,
                  counselors: selected.map(option => option.value)
                })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <Select
                isMulti
                options={courseOptions}
                value={courseOptions.filter(option => 
                  filters.courses.includes(option.value)
                )}
                onChange={selected => setFilters({
                  ...filters,
                  courses: selected.map(option => option.value)
                })}
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                onClick={() => setFilters({
                  dateRange: { from: null, to: null },
                  status: [],
                  counselors: [],
                  courses: []
                })}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Reset Filters
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedFilters;