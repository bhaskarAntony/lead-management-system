import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ArrowRight, Filter as FilterIcon, Search, Download } from 'lucide-react';
import AdvancedFilters from '../components/AdvancedFilters';
import useAuthStore from '../store/authStore';

const columnHelper = createColumnHelper();

function LeadsTable() {
  const [leads, setLeads] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { from: null, to: null },
    status: [],
    counselors: [],
    courses: []
  });

  const counselors = useAuthStore(state => state.counselors);

  useEffect(() => {
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(storedLeads);
  }, []);

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <div>
          <p className="font-medium text-gray-900">{info.getValue()}</p>
          <p className="text-sm text-gray-500">{info.row.original.course}</p>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          info.getValue() === 'Converted' ? 'bg-green-100 text-green-800' :
          info.getValue() === 'Not Interested' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('counselor', {
      header: 'Counselor',
      cell: info => {
        const counselorId = info.getValue();
        const counselor = counselors.find(c => c.id === counselorId);
        return counselor ? counselor.name : (counselorId === 'superadmin' ? 'Super Admin' : '-');
      }
    }),
    columnHelper.accessor('phone', {
      header: 'Contact',
      cell: info => (
        <div>
          <a href={`tel:${info.getValue()}`} className="text-gray-600 hover:text-indigo-600">
            {info.getValue()}
          </a>
          <p className="text-sm text-gray-500">{info.row.original.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Registration Date',
      cell: info => format(new Date(info.getValue()), 'MMM dd, yyyy HH:mm'),
    }),
    columnHelper.accessor('lastUpdated', {
      header: 'Last Updated',
      cell: info => format(new Date(info.getValue() || info.row.original.createdAt), 'MMM dd, yyyy HH:mm'),
    }),
    columnHelper.accessor('_id', {
      header: '',
      cell: info => (
        <Link
          to={`/lead/${info.getValue()}`}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          View
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      ),
    }),
  ];

  const filteredData = React.useMemo(() => {
    return leads.filter(lead => {
      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const leadDate = new Date(lead.createdAt);
        if (filters.dateRange.from && leadDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && leadDate > filters.dateRange.to) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(lead.status)) {
        return false;
      }

      // Counselor filter
      if (filters.counselors.length > 0 && !filters.counselors.includes(lead.counselor)) {
        return false;
      }

      // Course filter
      if (filters.courses.length > 0 && !filters.courses.includes(lead.course)) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const exportToCSV = () => {
    const headers = columns.map(col => col.header).filter(Boolean).join(',');
    const rows = filteredData.map(lead => 
      columns
        .map(col => lead[col.accessorKey])
        .filter(Boolean)
        .join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">All Leads</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center space-x-1 ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showFilters && (
        <AdvancedFilters
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}

export default LeadsTable;