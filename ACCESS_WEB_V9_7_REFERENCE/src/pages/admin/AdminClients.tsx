import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import type { Client } from '../../types';

// Initial test data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@techcorp.com',
    company: 'Tech Corp',
    plan: 'professional',
    status: 'active',
    joinedDate: '2024-01-15',
    domains: ['techcorp.com', 'tech-blog.com']
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@designstudio.com',
    company: 'Design Studio',
    plan: 'basic',
    status: 'active',
    joinedDate: '2024-02-01',
    domains: ['designstudio.com']
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@innovate.co',
    company: 'Innovate Co',
    plan: 'enterprise',
    status: 'active',
    joinedDate: '2024-02-15',
    domains: ['innovate.co', 'innovate.app', 'innovate.dev']
  },
  {
    id: '4',
    name: 'Emma Thompson',
    email: 'emma@webcraft.io',
    company: 'WebCraft',
    plan: 'professional',
    status: 'pending',
    joinedDate: '2024-03-01',
    domains: ['webcraft.io']
  },
  {
    id: '5',
    name: 'David Rodriguez',
    email: 'david@digitalagency.com',
    company: 'Digital Agency',
    plan: 'professional',
    status: 'inactive',
    joinedDate: '2024-01-20',
    domains: ['digitalagency.com', 'digital-portfolio.com']
  }
];

interface ClientFormData {
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
  domains: string[];
}

const initialFormData: ClientFormData = {
  name: '',
  email: '',
  company: '',
  plan: 'basic',
  status: 'pending',
  domains: ['']
};

const columnHelper = createColumnHelper<Client>();

export function AdminClients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);

  const columns = [
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('company', {
      header: 'Company',
    }),
    columnHelper.accessor('plan', {
      header: 'Plan',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'active':
              return 'bg-green-100 text-green-800';
            case 'inactive':
              return 'bg-red-100 text-red-800';
            case 'pending':
              return 'bg-yellow-100 text-yellow-800';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        };

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor('joinedDate', {
      header: ({ column }) => (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Joined Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleOpenModal(row.original)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: clients,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        company: client.company,
        plan: client.plan,
        status: client.status,
        domains: client.domains
      });
    } else {
      setEditingClient(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData(initialFormData);
  };

  const handleAddDomain = () => {
    setFormData(prev => ({
      ...prev,
      domains: [...prev.domains, '']
    }));
  };

  const handleRemoveDomain = (index: number) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.filter((_, i) => i !== index)
    }));
  };

  const handleDomainChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.map((domain, i) => i === index ? value : domain)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingClient) {
        // Update existing client
        const updatedClient = {
          ...editingClient,
          ...formData
        };
        setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
        toast.success('Client updated successfully');
      } else {
        // Create new client
        const newClient: Client = {
          id: Date.now().toString(),
          ...formData,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        setClients([...clients, newClient]);
        toast.success('Client created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save client');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        setClients(clients.filter(c => c.id !== id));
        toast.success('Client deleted successfully');
      } catch (error) {
        toast.error('Failed to delete client');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search clients..."
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Page{' '}
              <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
              <span className="font-medium">{table.getPageCount()}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </Dialog.Title>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="basic">Basic</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'pending' }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domains
                </label>
                {formData.domains.map((domain, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => handleDomainChange(index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDomain(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddDomain}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Domain
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}