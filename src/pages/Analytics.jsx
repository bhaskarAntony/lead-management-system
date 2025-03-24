import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Analytics() {
  const [leads, setLeads] = useState([]);
  const [dateRange, setDateRange] = useState('7'); // days

  useEffect(() => {
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(storedLeads);
  }, []);

  const getFilteredLeads = () => {
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, parseInt(dateRange)));
    return leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= startDate && leadDate <= endDate;
    });
  };

  const getStatusData = () => {
    const statusCount = {};
    getFilteredLeads().forEach(lead => {
      statusCount[lead.status] = (statusCount[lead.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const getDailyLeads = () => {
    const dailyCount = {};
    getFilteredLeads().forEach(lead => {
      const date = format(new Date(lead.createdAt), 'MMM dd');
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });
    return Object.entries(dailyCount).map(([date, count]) => ({ date, count }));
  };

  const getConversionRate = () => {
    const filtered = getFilteredLeads();
    const converted = filtered.filter(lead => lead.status === 'Converted').length;
    return ((converted / filtered.length) * 100).toFixed(1);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Leads</h3>
          <p className="text-3xl font-bold text-indigo-600">{getFilteredLeads().length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-green-600">{getConversionRate()}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Follow-ups</h3>
          <p className="text-3xl font-bold text-orange-600">
            {getFilteredLeads().filter(lead => lead.status === 'Follow Up').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Daily Lead Trend</h3>
          <BarChart width={500} height={300} data={getDailyLeads()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="New Leads" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Lead Status Distribution</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={getStatusData()}
              cx={250}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {getStatusData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default Analytics;