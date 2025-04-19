import React from 'react';
import { Lock } from 'lucide-react';

const permissions = [
  {
    id: '1',
    name: 'Scan Management',
    description: 'Run and manage accessibility scans',
    roles: ['Admin', 'Editor']
  },
  {
    id: '2',
    name: 'Report Access',
    description: 'View and download accessibility reports',
    roles: ['Admin', 'Editor', 'Viewer']
  },
  {
    id: '3',
    name: 'Team Management',
    description: 'Manage team members and roles',
    roles: ['Admin']
  },
  {
    id: '4',
    name: 'Billing Access',
    description: 'View and manage billing information',
    roles: ['Admin']
  }
];

export function TeamPermissions() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Permissions</h2>
        <p className="mt-1 text-sm text-gray-500">Review and manage role permissions.</p>
      </div>

      <div className="divide-y divide-gray-200">
        {permissions.map((permission) => (
          <div key={permission.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{permission.name}</h3>
                  <p className="text-sm text-gray-500">{permission.description}</p>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  {permission.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}