import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, Mail, Calendar, ArrowLeft, MessageSquare, 
  Copy, CheckCircle, XCircle, Clock, UserCheck,
  PhoneOff, CalendarCheck, UserX, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import useAuthStore from '../store/authStore';

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

const STATUS_ICONS = {
  [LEAD_STATUSES.NEW]: Clock,
  [LEAD_STATUSES.FOLLOWUP]: Phone,
  [LEAD_STATUSES.RNR]: PhoneOff,
  [LEAD_STATUSES.NOT_INTERESTED]: UserX,
  [LEAD_STATUSES.WALKING]: UserCheck,
  [LEAD_STATUSES.DEMO_SCHEDULED]: Calendar,
  [LEAD_STATUSES.DEMO_COMPLETED]: CalendarCheck,
  [LEAD_STATUSES.CONVERTED]: CheckCircle
};

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const counselors = useAuthStore(state => state.counselors);
  const [remark, setRemark] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCounselor, setSelectedCounselor] = useState('');
  
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  const lead = leads.find(l => l._id === id);

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Lead not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const updateLeadStatus = () => {
    if (!selectedStatus || !remark.trim() || !selectedCounselor) return;

    const updatedLeads = leads.map(l => {
      if (l._id === id) {
        return {
          ...l,
          status: selectedStatus,
          counselor: selectedCounselor,
          remarks: [...(l.remarks || []), {
            status: selectedStatus,
            remark: remark.trim(),
            timestamp: new Date().toISOString(),
            counselor: selectedCounselor
          }],
          lastUpdated: new Date().toISOString()
        };
      }
      return l;
    });

    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    setRemark('');
    setSelectedStatus('');
    setSelectedCounselor('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case LEAD_STATUSES.CONVERTED:
        return 'bg-green-100 text-green-800';
      case LEAD_STATUSES.NOT_INTERESTED:
      case LEAD_STATUSES.RNR:
        return 'bg-red-100 text-red-800';
      case LEAD_STATUSES.WALKING:
      case LEAD_STATUSES.DEMO_SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case LEAD_STATUSES.DEMO_COMPLETED:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusTimeline = () => {
    const timeline = Object.values(LEAD_STATUSES).map(status => ({
      status,
      completed: lead.remarks?.some(r => r.status === status) || lead.status === status,
      current: lead.status === status
    }));

    return timeline;
  };

  const StatusIcon = STATUS_ICONS[lead.status];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{lead.name}</h1>
            <p className="text-lg text-gray-600">{lead.course}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
            {lead.counselor && (
              <span className="text-sm text-gray-500">
                Assigned to: {counselors.find(c => c.id === lead.counselor)?.name || lead.counselor}
              </span>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lead Progress</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              {getStatusTimeline().map((item, index) => {
                const StatusIcon = STATUS_ICONS[item.status];
                return (
                  <div
                    key={item.status}
                    className={`flex flex-col items-center ${
                      index === 0 ? 'text-left' : index === getStatusTimeline().length - 1 ? 'text-right' : 'text-center'
                    }`}
                  >
                    <div className={`
                      flex h-8 w-8 items-center justify-center rounded-full
                      ${item.completed 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                      }
                      ${item.current ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}
                    `}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <p className="mt-2 text-xs font-medium text-gray-500">
                      {item.status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between group">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <a href={`tel:${lead.phone}`} className="hover:text-indigo-600">
                    {lead.phone}
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(lead.phone)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <a href={`mailto:${lead.email}`} className="hover:text-indigo-600">
                    {lead.email}
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(lead.email)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3" />
                <span>Registered on {format(new Date(lead.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Status</h2>
            <div className="space-y-4">
              <select
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select Counselor</option>
                <option value="superadmin">Super Admin</option>
                {counselors.map(counselor => (
                  <option key={counselor.id} value={counselor.id}>
                    {counselor.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select Status</option>
                {Object.values(LEAD_STATUSES).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add your remarks..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="3"
              />
              <button
                onClick={updateLeadStatus}
                disabled={!selectedStatus || !remark.trim() || !selectedCounselor}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Lead Timeline</h2>
          <div className="space-y-6">
            {[...(lead.remarks || [])].reverse().map((remark, index) => {
              const StatusIcon = STATUS_ICONS[remark.status];
              const counselorName = remark.counselor === 'superadmin' 
                ? 'Super Admin' 
                : counselors.find(c => c.id === remark.counselor)?.name || remark.counselor;

              return (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full ${getStatusColor(remark.status)} flex items-center justify-center`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{remark.status}</p>
                      <p className="text-xs text-gray-500">
                        Updated by {counselorName}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{remark.remark}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(remark.timestamp), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetails;