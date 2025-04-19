import React from 'react';
import { UserPlus, MoreVertical, Mail } from 'lucide-react';

const members = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

export function TeamMembers() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your team members and their roles.</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {members.map((member) => (
          <div key={member.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={member.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {member.role}
                </span>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}