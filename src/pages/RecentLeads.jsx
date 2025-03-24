import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, isToday, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Calendar, ArrowRight } from 'lucide-react';

function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(storedLeads);
  }, []);

  const getFilteredLeads = () => {
    const start = startOfDay(selectedDate);
    const end = endOfDay(selectedDate);
    return leads.filter(lead => {
      const leadDate = parseISO(lead.createdAt);
      return leadDate >= start && leadDate <= end;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isToday(selectedDate) ? "Today's Leads" : `Leads for ${format(selectedDate, 'MMMM dd, yyyy')}`}
        </h1>
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-500" />
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 divide-y">
          {getFilteredLeads().map(lead => (
            <div key={lead._id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
                  <p className="text-sm text-gray-500">{lead.course}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      Registered at: {format(new Date(lead.createdAt), 'HH:mm')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Current Status: <span className={`font-medium ${
                        lead.status === 'Converted' ? 'text-green-600' :
                        lead.status === 'Not Interested' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>{lead.status}</span>
                    </p>
                  </div>
                </div>
                <Link
                  to={`/lead/${lead._id}`}
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              {lead.remarks && lead.remarks.length > 0 && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Latest Update:</p>
                  <p className="text-sm text-gray-600 mt-1">{lead.remarks[lead.remarks.length - 1].remark}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(lead.remarks[lead.remarks.length - 1].timestamp), 'HH:mm')}
                  </p>
                </div>
              )}
            </div>
          ))}
          {getFilteredLeads().length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No leads found for this date
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentLeads;