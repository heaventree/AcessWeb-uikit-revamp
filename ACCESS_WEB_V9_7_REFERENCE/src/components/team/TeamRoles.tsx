import React from 'react';
import { Shield, Plus } from 'lucide-react';

const roles = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full access to all features',
    members: 2
  },
  {
    id: '2',
    name: 'Editor',
    description: 'Can edit and manage content',
    members: 3
  },
  {
    id: '3',
    name: 'Viewer',
    description: 'Can view reports and analytics',
    members: 5
  }
];

export function TeamRoles() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Team Roles</h2>
            <p className="mt-1 text-sm text-gray-500">Manage roles and permissions for team members.</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            Add Role
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {roles.map((role) => (
          <div key={role.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{role.members} members</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}