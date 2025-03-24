import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Calendar, ArrowRight, Search, Users, TrendingUp, UserCheck, UserX, Clock, PhoneCall, Calendar as CalendarIcon, Clock as UserClock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const LEAD_STATUSES = {
  NEW: 'New',
  FOLLOWUP: 'Follow Up',
  RNR: 'RNR',
  NOT_INTERESTED: 'Not Interested',
  WALKING: 'Walking',
  DEMO_SCHEDULED: 'Demo Scheduled',
  DEMO_COMPLETED: 'Demo Completed',
  CONVERTED: 'Converted'
};

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7');
  const [tableScrolled, setTableScrolled] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('https://api.be-practical.com/course/register/list');
        const data = await response.json();
        
        const transformedLeads = data.data.map(lead => ({
          ...lead,
          status: localStorage.getItem(`lead_${lead._id}_status`) || LEAD_STATUSES.NEW,
          remarks: JSON.parse(localStorage.getItem(`lead_${lead._id}_remarks`) || '[]'),
          lastUpdated: localStorage.getItem(`lead_${lead._id}_lastUpdated`) || lead.createdAt
        }));
        
        setLeads(transformedLeads);
        localStorage.setItem('leads', JSON.stringify(transformedLeads));
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, []);

  const getFilteredLeads = () => {
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, parseInt(dateRange)));
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesDate = new Date(lead.createdAt) >= startDate && new Date(lead.createdAt) <= endDate;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const getStatusCount = (status) => {
    return leads.filter(lead => lead.status === status).length;
  };

  const getStatusData = () => {
    return Object.values(LEAD_STATUSES).map(status => ({
      name: status,
      value: getStatusCount(status)
    }));
  };

  const getDailyLeads = () => {
    const dailyData = {};
    getFilteredLeads().forEach(lead => {
      const date = format(new Date(lead.createdAt), 'MMM dd');
      if (!dailyData[date]) {
        dailyData[date] = { date, total: 0, converted: 0, walking: 0 };
      }
      dailyData[date].total++;
      if (lead.status === LEAD_STATUSES.CONVERTED) dailyData[date].converted++;
      if (lead.status === LEAD_STATUSES.WALKING) dailyData[date].walking++;
    });
    return Object.values(dailyData);
  };

  const getConversionTrend = () => {
    const data = getDailyLeads();
    return data.map(day => ({
      date: day.date,
      rate: day.total ? ((day.converted / day.total) * 100).toFixed(1) : 0
    }));
  };

  const getStatusDistribution = () => {
    const total = getFilteredLeads().length;
    return Object.values(LEAD_STATUSES).map(status => ({
      name: status,
      value: (getStatusCount(status) / total * 100).toFixed(1)
    }));
  };

  const getHourlyDistribution = () => {
    const hourlyData = Array(24).fill(0).map((_, i) => ({
      hour: i,
      leads: 0
    }));

    getFilteredLeads().forEach(lead => {
      const hour = new Date(lead.createdAt).getHours();
      hourlyData[hour].leads++;
    });

    return hourlyData;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Lead Management Dashboard</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <h3 className="text-2xl font-bold text-gray-800">{leads.length}</h3>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">
                {getFilteredLeads().length} in selected period
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Converted</p>
              <h3 className="text-2xl font-bold text-green-600">
                {getStatusCount(LEAD_STATUSES.CONVERTED)}
              </h3>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">
                {((getStatusCount(LEAD_STATUSES.CONVERTED) / leads.length) * 100).toFixed(1)}% conversion rate
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Walking</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {getStatusCount(LEAD_STATUSES.WALKING)}
              </h3>
            </div>
            <UserClock className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-500">
                Potential conversions
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Follow-ups</p>
              <h3 className="text-2xl font-bold text-orange-600">
                {getStatusCount(LEAD_STATUSES.FOLLOWUP)}
              </h3>
            </div>
            <PhoneCall className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm text-orange-500">
                Require attention
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Lead Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Daily Lead Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDailyLeads()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total Leads" />
              <Bar dataKey="converted" fill="#82ca9d" name="Converted" />
              <Bar dataKey="walking" fill="#ffc658" name="Walking" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Conversion Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getConversionTrend()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#8884d8" name="Conversion Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getStatusDistribution()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {getStatusDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Hourly Lead Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getHourlyDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="leads" stroke="#8884d8" fill="#8884d8" name="Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Leads</h3>
            <select
              className="border rounded-lg px-4 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {Object.values(LEAD_STATUSES).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={`overflow-x-auto ${tableScrolled ? 'shadow-inner' : ''}`}
             onScroll={(e) => setTableScrolled(e.target.scrollLeft > 0)}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredLeads().slice(0, 10).map(lead => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lead.status === LEAD_STATUSES.CONVERTED ? 'bg-green-100 text-green-800' :
                      lead.status === LEAD_STATUSES.NOT_INTERESTED ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.phone}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(lead.createdAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(lead.lastUpdated), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/lead/${lead._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t">
          <Link
            to="/leads"
            className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
          >
            View All Leads
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;