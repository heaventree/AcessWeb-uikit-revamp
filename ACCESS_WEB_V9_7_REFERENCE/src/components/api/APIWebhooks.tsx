import React, { useState, useEffect } from 'react';
import { APIWebhook } from '../../types/integrations';
import { useToast } from '../../hooks/useToast';
import { storageService } from '../../lib/storage';

// Since Heroicons aren't included by default, we'll create simple icon components
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

// Import UI components
const Button = ({ children, variant = 'primary', onClick, disabled = false, icon, className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const Input = ({ label, id, type = 'text', value, onChange, placeholder, required = false, error, fullWidth = false }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
          error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'
        } ${fullWidth ? 'w-full' : ''}`}
        required={required}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const Toggle = ({ id, checked, onChange }) => {
  return (
    <button
      type="button"
      id={id}
      aria-pressed={checked}
      className={`
        h-6 w-11 relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent 
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
      onClick={onChange}
    >
      <span className="sr-only">{checked ? 'Enable' : 'Disable'}</span>
      <span
        className={`
          h-5 w-5 pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

const Badge = ({ children, color = 'gray', className = '' }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className="relative inline-block" 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-10 px-2 py-1 -mt-1 text-xs text-white bg-gray-900 rounded-md bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
          {content}
        </div>
      )}
    </div>
  );
};

const WEBHOOK_EVENTS = [
  { id: 'scan.started', label: 'Scan Started' },
  { id: 'scan.completed', label: 'Scan Completed' },
  { id: 'scan.failed', label: 'Scan Failed' },
  { id: 'issue.found', label: 'Issue Found' },
  { id: 'issue.fixed', label: 'Issue Fixed' },
];

export function APIWebhooks() {
  const [webhooks, setWebhooks] = useState<APIWebhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const { showToast } = useToast();

  // Form state
  const [url, setUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Load webhooks on component mount
  useEffect(() => {
    fetchWebhooks();
  }, []);

  // Fetch webhooks from API
  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would use the API client
      const storedWebhooks = await storageService.getItem<APIWebhook[]>('api_webhooks') || [];
      setWebhooks(storedWebhooks);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      showToast({
        type: 'error',
        title: 'Failed to fetch webhooks',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new webhook
  const createWebhook = async () => {
    // Validate form
    if (!url) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Webhook URL is required',
      });
      return;
    }

    if (selectedEvents.length === 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'At least one event must be selected',
      });
      return;
    }

    setIsSaving(true);
    try {
      // In a real implementation, this would use the API client
      const newWebhook: APIWebhook = {
        id: Date.now().toString(),
        url,
        events: selectedEvents,
        secret: generateWebhookSecret(),
        active: isActive,
        created: new Date().toISOString(),
      };

      const updatedWebhooks = [...webhooks, newWebhook];
      await storageService.setItem('api_webhooks', updatedWebhooks);
      setWebhooks(updatedWebhooks);

      // Reset form
      setUrl('');
      setSelectedEvents([]);
      setIsActive(true);
      setShowForm(false);

      showToast({
        type: 'success',
        title: 'Webhook Created',
        message: 'Webhook has been created successfully',
      });
    } catch (error) {
      console.error('Failed to create webhook:', error);
      showToast({
        type: 'error',
        title: 'Failed to create webhook',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a webhook
  const deleteWebhook = async (id: string) => {
    try {
      const updatedWebhooks = webhooks.filter(webhook => webhook.id !== id);
      await storageService.setItem('api_webhooks', updatedWebhooks);
      setWebhooks(updatedWebhooks);

      showToast({
        type: 'success',
        title: 'Webhook Deleted',
        message: 'Webhook has been deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      showToast({
        type: 'error',
        title: 'Failed to delete webhook',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  // Toggle webhook active status
  const toggleWebhookStatus = async (id: string) => {
    try {
      const updatedWebhooks = webhooks.map(webhook => {
        if (webhook.id === id) {
          return { ...webhook, active: !webhook.active };
        }
        return webhook;
      });

      await storageService.setItem('api_webhooks', updatedWebhooks);
      setWebhooks(updatedWebhooks);

      showToast({
        type: 'success',
        title: 'Webhook Updated',
        message: 'Webhook status has been updated successfully',
      });
    } catch (error) {
      console.error('Failed to update webhook status:', error);
      showToast({
        type: 'error',
        title: 'Failed to update webhook',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  // Toggle event selection
  const toggleEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  // Generate a webhook secret
  const generateWebhookSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">API Webhooks</h2>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={fetchWebhooks}
            disabled={loading}
            icon={<RefreshIcon />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
            icon={<PlusIcon />}
          >
            Add Webhook
          </Button>
        </div>
      </div>

      {/* Webhook Form */}
      {showForm && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-medium mb-4">Create New Webhook</h3>
          <div className="space-y-4">
            <div>
              <Input
                id="webhook-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourdomain.com/webhook"
                label="Webhook URL"
                required={true}
                fullWidth={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Events <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {WEBHOOK_EVENTS.map(event => (
                  <div
                    key={event.id}
                    className={`
                      p-3 rounded border cursor-pointer transition-all
                      ${
                        selectedEvents.includes(event.id)
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => toggleEvent(event.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded"
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => {}}
                      />
                      <label className="ml-2 block text-sm" htmlFor={`event-${event.id}`}>
                        {event.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <Toggle id="webhook-active" checked={isActive} onChange={() => setIsActive(!isActive)} />
                <label htmlFor="webhook-active" className="ml-2 block text-sm font-medium text-gray-700">
                  Webhook Active
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={createWebhook} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Create Webhook'
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Webhooks List */}
      {loading ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading webhooks...</p>
        </div>
      ) : webhooks.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-gray-50">
          <p className="text-gray-600">No webhooks configured yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Create a webhook to receive notifications about events in your account.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map(webhook => (
            <Card key={webhook.id} className="p-5 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 truncate max-w-lg" title={webhook.url}>
                    {webhook.url}
                  </h4>
                  <p className="text-sm text-gray-500">Created {formatDate(webhook.created)}</p>
                </div>
                <div className="flex space-x-2 items-center">
                  <Tooltip content={webhook.active ? 'Webhook is active' : 'Webhook is inactive'}>
                    <Badge color={webhook.active ? 'green' : 'gray'}>
                      {webhook.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Tooltip>
                  <Toggle
                    id={`toggle-${webhook.id}`}
                    checked={webhook.active}
                    onChange={() => toggleWebhookStatus(webhook.id)}
                  />
                  <Button
                    variant="danger"
                    onClick={() => deleteWebhook(webhook.id)}
                    icon={<TrashIcon />}
                  />
                </div>
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {webhook.events.map(eventId => {
                    const event = WEBHOOK_EVENTS.find(e => e.id === eventId);
                    return (
                      <Badge key={eventId} color="blue">
                        {event?.label || eventId}
                      </Badge>
                    );
                  })}
                </div>

                <div className="mt-2 text-sm text-gray-600 flex items-center">
                  <span className="font-medium">Secret:</span>
                  <code className="ml-2 p-1 bg-gray-100 rounded text-xs">
                    {webhook.secret.substring(0, 8)}
                    {'•'.repeat(20)}
                  </code>
                </div>

                {webhook.lastTriggered && (
                  <div className="mt-1 text-sm text-gray-600">
                    Last triggered: {formatDate(webhook.lastTriggered)}
                    {webhook.failureCount && webhook.failureCount > 0 ? (
                      <Badge color="red" className="ml-2">
                        {webhook.failureCount} failures
                      </Badge>
                    ) : null}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default APIWebhooks;