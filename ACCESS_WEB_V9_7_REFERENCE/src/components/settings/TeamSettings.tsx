import React, { useState } from 'react';
import { Users, Settings, Shield } from 'lucide-react';

export function TeamSettings() {
  const [settings, setSettings] = useState({
    allowInvites: true,
    requireApproval: true,
    defaultRole: 'viewer',
    maxTeamSize: 10,
    enforceSSO: false
  });

  const handleChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Team Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Configure team-wide settings and policies.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Team Invitations */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Team Invitations</h3>
              <p className="text-sm text-gray-500">Control who can invite new team members</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.allowInvites}
              onClick={() => handleChange('allowInvites', !settings.allowInvites)}
              className={`${
                settings.allowInvites ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                aria-hidden="true"
                className={`${
                  settings.allowInvites ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>

        {/* Approval Required */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Require Approval</h3>
              <p className="text-sm text-gray-500">Require admin approval for new team members</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.requireApproval}
              onClick={() => handleChange('requireApproval', !settings.requireApproval)}
              className={`${
                settings.requireApproval ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                aria-hidden="true"
                className={`${
                  settings.requireApproval ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>

        {/* Default Role */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Default Role</h3>
          <p className="text-sm text-gray-500">Set the default role for new team members</p>
          <select
            value={settings.defaultRole}
            onChange={(e) => handleChange('defaultRole', e.target.value)}
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Team Size */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Maximum Team Size</h3>
          <p className="text-sm text-gray-500">Set the maximum number of team members</p>
          <input
            type="number"
            value={settings.maxTeamSize}
            onChange={(e) => handleChange('maxTeamSize', parseInt(e.target.value))}
            min="1"
            max="100"
            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* SSO Settings */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Enforce SSO</h3>
              <p className="text-sm text-gray-500">Require Single Sign-On for all team members</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.enforceSSO}
              onClick={() => handleChange('enforceSSO', !settings.enforceSSO)}
              className={`${
                settings.enforceSSO ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                aria-hidden="true"
                className={`${
                  settings.enforceSSO ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Settings className="h-5 w-5 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}