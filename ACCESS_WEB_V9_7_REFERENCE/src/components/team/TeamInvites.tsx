import React from 'react';
import { Mail, X } from 'lucide-react';

const invites = [
  {
    id: '1',
    email: 'sarah@example.com',
    role: 'Editor',
    sent: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'mike@example.com',
    role: 'Viewer',
    sent: '2024-03-14T15:30:00Z'
  }
];

export function TeamInvites() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Pending Invites</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your pending team invitations.</p>
      </div>

      <div className="divide-y divide-gray-200">
        {invites.map((invite) => (
          <div key={invite.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{invite.email}</h3>
                  <p className="text-sm text-gray-500">
                    Invited {new Date(invite.sent).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
                <button className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {invites.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500">No pending invites</p>
        </div>
      )}
    </div>
  );
}