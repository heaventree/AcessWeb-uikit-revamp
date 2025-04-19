import { useState } from 'react';
import { Users, UserPlus, Settings, Shield } from 'lucide-react';
import { TeamMembers } from '../../components/team/TeamMembers';
import { TeamInvites } from '../../components/team/TeamInvites';
import { TeamRoles } from '../../components/team/TeamRoles';
import { TeamPermissions } from '../../components/team/TeamPermissions';

export function TeamPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'roles' | 'permissions'>('members');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Team Management
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage team members, roles, and permissions
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'members'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Team Members
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invites'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <UserPlus className="w-5 h-5 inline-block mr-2" />
            Invitations
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Settings className="w-5 h-5 inline-block mr-2" />
            Roles
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Shield className="w-5 h-5 inline-block mr-2" />
            Permissions
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'members' && (
          <TeamMembers />
        )}
        
        {activeTab === 'invites' && (
          <TeamInvites />
        )}
        
        {activeTab === 'roles' && (
          <TeamRoles />
        )}
        
        {activeTab === 'permissions' && (
          <TeamPermissions />
        )}
      </div>
    </div>
  );
}