import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CreditCard, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import type { PaymentGateway } from '../../types';
import { paymentGatewayService } from '../../services/paymentGatewayService';
import { toast } from 'react-hot-toast';

const GatewayIcons = {
  Stripe: () => (
    <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" width="60" height="25" fill="none" className="text-blue-500">
      <path fill="currentColor" d="M59.64 14.28h-8.06v-1.2h8.05l.01 1.2zm-18.54-1.21h-4.92v1.2h4.92v-1.2zm-14.46 0h-4.93v1.2h4.93v-1.2zm-14.47 0H7.24v1.2h4.93v-1.2zM59.64 8.77h-3.39V7.56h3.39v1.21zm-18.54-1.21h-4.92v1.2h4.92V7.56zm-14.46 0h-4.93v1.2h4.93V7.56zm-14.47 0H7.24v1.2h4.93V7.56zm47.47 9.92h-3.39v-1.2h3.39v1.2zm-18.54-1.21h-4.92v1.2h4.92v-1.2zm-14.46 0h-4.93v1.2h4.93v-1.2zm-14.47 0H7.24v1.2h4.93v-1.2z"/>
    </svg>
  ),
  PayPal: () => (
    <svg viewBox="0 0 101 32" xmlns="http://www.w3.org/2000/svg" width="101" height="32" fill="none" className="text-[#003087]">
      <path fill="currentColor" d="M 12.237 2.8 L 4.437 2.8 C 3.937 2.8 3.437 3.2 3.337 3.7 L 0.237 23.7 C 0.137 24.1 0.437 24.4 0.837 24.4 L 4.537 24.4 C 5.037 24.4 5.537 24 5.637 23.5 L 6.437 18.1 C 6.537 17.6 6.937 17.2 7.537 17.2 L 9.937 17.2 C 14.437 17.2 16.937 15.1 17.537 10.9 C 17.837 9.1 17.637 7.6 16.737 6.5 C 15.737 5.3 14.137 4.8 12.237 4.8 Z M 13.137 11.1 C 12.737 13.6 10.937 13.6 9.037 13.6 L 7.337 13.6 L 8.137 8.2 C 8.137 7.9 8.437 7.7 8.737 7.7 L 9.537 7.7 C 10.937 7.7 12.237 7.7 12.937 8.4 C 13.437 8.9 13.437 9.8 13.137 11.1 Z"/>
      <path fill="currentColor" d="M 35.437 10.8 L 31.737 10.8 C 31.437 10.8 31.137 11 31.037 11.3 L 30.837 12.4 L 30.537 12 C 29.837 10.9 28.037 10.5 26.237 10.5 C 22.137 10.5 18.637 13.6 17.937 17.9 C 17.537 20 18.037 22 19.337 23.3 C 20.437 24.5 22.137 25 24.037 25 C 27.337 25 29.237 23 29.237 23 L 29.037 24.1 C 28.937 24.5 29.237 24.8 29.637 24.8 L 33.037 24.8 C 33.537 24.8 34.037 24.4 34.137 23.9 L 36.037 11.5 C 36.137 11.2 35.837 10.8 35.437 10.8 Z M 30.337 18.1 C 29.937 20.2 28.337 21.7 26.137 21.7 C 25.037 21.7 24.237 21.4 23.637 20.8 C 23.037 20.2 22.837 19.4 23.037 18.4 C 23.337 16.3 25.137 14.8 27.237 14.8 C 28.337 14.8 29.137 15.1 29.737 15.7 C 30.237 16.3 30.537 17.1 30.337 18.1 Z"/>
      <path fill="currentColor" d="M 55.337 10.8 L 51.637 10.8 C 51.237 10.8 50.937 11 50.737 11.3 L 45.537 19.1 L 43.337 11.6 C 43.237 11.1 42.737 10.8 42.337 10.8 L 38.637 10.8 C 38.237 10.8 37.837 11.2 38.037 11.6 L 42.137 23.7 L 38.237 29.2 C 37.937 29.6 38.237 30.1 38.737 30.1 L 42.437 30.1 C 42.837 30.1 43.137 29.9 43.337 29.6 L 55.937 11.7 C 56.237 11.3 55.937 10.8 55.337 10.8 Z"/>
      <path fill="currentColor" d="M 67.737 2.8 L 59.937 2.8 C 59.437 2.8 58.937 3.2 58.837 3.7 L 55.737 23.7 C 55.637 24.1 55.937 24.4 56.337 24.4 L 60.337 24.4 C 60.737 24.4 61.037 24.1 61.137 23.8 L 61.937 18.1 C 62.037 17.6 62.437 17.2 63.037 17.2 L 65.437 17.2 C 69.937 17.2 72.437 15.1 73.037 10.9 C 73.337 9.1 73.137 7.6 72.237 6.5 C 71.237 5.3 69.637 4.8 67.737 4.8 Z M 68.637 11.1 C 68.237 13.6 66.437 13.6 64.537 13.6 L 62.837 13.6 L 63.637 8.2 C 63.637 7.9 63.937 7.7 64.237 7.7 L 65.037 7.7 C 66.437 7.7 67.737 7.7 68.437 8.4 C 68.937 8.9 68.937 9.8 68.637 11.1 Z"/>
      <path fill="currentColor" d="M 90.937 10.8 L 87.237 10.8 C 86.937 10.8 86.637 11 86.537 11.3 L 86.337 12.4 L 86.037 12 C 85.337 10.9 83.537 10.5 81.737 10.5 C 77.637 10.5 74.137 13.6 73.437 17.9 C 73.037 20 73.537 22 74.837 23.3 C 75.937 24.5 77.637 25 79.537 25 C 82.837 25 84.737 23 84.737 23 L 84.537 24.1 C 84.437 24.5 84.737 24.8 85.137 24.8 L 88.537 24.8 C 89.037 24.8 89.537 24.4 89.637 23.9 L 91.537 11.5 C 91.637 11.2 91.337 10.8 90.937 10.8 Z M 85.837 18.1 C 85.437 20.2 83.837 21.7 81.637 21.7 C 80.537 21.7 79.737 21.4 79.137 20.8 C 78.537 20.2 78.337 19.4 78.537 18.4 C 78.837 16.3 80.637 14.8 82.737 14.8 C 83.837 14.8 84.637 15.1 85.237 15.7 C 85.737 16.3 86.037 17.1 85.837 18.1 Z"/>
      <path fill="currentColor" d="M 95.337 3.3 L 92.137 23.7 C 92.037 24.1 92.337 24.4 92.737 24.4 L 95.937 24.4 C 96.437 24.4 96.937 24 97.037 23.5 L 100.237 3.5 C 100.337 3.1 100.037 2.8 99.637 2.8 L 96.037 2.8 C 95.737 2.8 95.437 3 95.337 3.3 Z"/>
    </svg>
  ),
  GoCardless: () => (
    <svg viewBox="0 0 652 138" xmlns="http://www.w3.org/2000/svg" width="120" height="25" fill="none" className="text-[#2C2C2C]">
      <path fill="currentColor" d="M69.1 0C31 0 0 31 0 69.1s31 69.1 69.1 69.1 69.1-31 69.1-69.1S107.3 0 69.1 0zm0 119.5c-27.8 0-50.4-22.6-50.4-50.4s22.6-50.4 50.4-50.4 50.4 22.6 50.4 50.4-22.6 50.4-50.4 50.4z"/>
      <path fill="currentColor" d="M188.7 34.8h-19.6v68.7h19.6V34.8zm142.1 0v41.3c0 9.8-6 16.9-15.8 16.9-9.8 0-15.8-7.1-15.8-16.9V34.8h-19.6v42.4c0 19.6 13.7 28.3 35.4 28.3 21.7 0 35.4-8.7 35.4-28.3V34.8h-19.6zm130.6 68.7V34.8h-19.6v68.7h19.6zM354.9 84.1c-7.1 0-12-3.8-12-10.9s4.9-10.9 12-10.9h24.5V84h-24.5v.1zm2.2 21.7c21.7 0 35.4-8.7 35.4-28.3V47.4c0-8.7-7.1-14.7-17.4-14.7h-27.2c-13.1 0-21.7 7.1-21.7 17.4 0 9.8 8.2 17.4 19.6 17.4h27.2v8.7c0 9.8-6 16.9-15.8 16.9h-27.2v12.8h27.1v-.1zm175.8-71h-19.6v68.7h48.5v-15.8h-28.9V34.8zM152.2 87.9c-9.8 0-15.8-7.1-15.8-16.9V55.5h38.6V40.8c0-19.6-13.7-28.3-35.4-28.3-21.7 0-35.4 8.7-35.4 28.3v42.4c0 19.6 13.7 28.3 35.4 28.3 21.7 0 35.4-8.7 35.4-28.3v-3.3h-19.6c0 9.8-6 16.9-15.8 16.9h38.6V71h-38.6v16.9h2.6z"/>
    </svg>
  ),
  Revolut: () => (
    <svg viewBox="0 0 141 32" xmlns="http://www.w3.org/2000/svg" width="141" height="32" fill="none" className="text-[#0666EB]">
      <path fill="currentColor" d="M41.3 8.1h4.3v15.7h-4.3V8.1zm23.4 0v15.7h-4.1v-9c-1.2 3-2.4 6.1-3.6 9h-3.5c-1.2-2.9-2.4-6-3.6-9v9h-4.1V8.1h6.2c1.2 3.1 2.4 6.2 3.6 9.3 1.2-3.1 2.4-6.2 3.6-9.3h5.5zm11.7 0v12.7h6.9v3H72.1V8.1h4.3zm16.5 0c4.1 0 6.9 2 6.9 5.7 0 2.7-1.5 4.5-3.8 5.2l4.4 4.8h-5.1l-3.8-4.4h-2.8v4.4h-4.3V8.1h8.5zm-3.5 8.5h3.5c1.8 0 2.8-1 2.8-2.6 0-1.6-1-2.7-2.8-2.7h-3.5v5.3zm23.2-8.5v3h-8.2v3.3h7.4v3h-7.4v3.3h8.2v3h-12.5V8.1h12.5zm14.9 0v3h-5v12.7h-4.3V11.1h-5V8.1h14.3zm9.1 0c4.1 0 6.9 2 6.9 5.7 0 2.7-1.5 4.5-3.8 5.2l4.4 4.8h-5.1l-3.8-4.4h-2.8v4.4h-4.3V8.1h8.5zm-3.5 8.5h3.5c1.8 0 2.8-1 2.8-2.6 0-1.6-1-2.7-2.8-2.7h-3.5v5.3z"/>
      <path fill="currentColor" d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm7.4 22.6c-.5.5-1.2.8-1.9.8H10.5c-.7 0-1.4-.3-1.9-.8-.5-.5-.8-1.2-.8-1.9V11.3c0-.7.3-1.4.8-1.9.5-.5 1.2-.8 1.9-.8h10.9c.7 0 1.4.3 1.9.8.5.5.8 1.2.8 1.9v9.4c.1.7-.2 1.4-.7 1.9z"/>
    </svg>
  )
};

export function AdminPaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    try {
      const data = await paymentGatewayService.getAllGateways();
      setGateways(data);
    } catch (error) {
      toast.error('Failed to load payment gateways');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (gateway: PaymentGateway) => {
    try {
      const updated = await paymentGatewayService.toggleGateway(gateway.id);
      if (updated) {
        setGateways(gateways.map(g => g.id === gateway.id ? updated : g));
        toast.success(`${gateway.name} has been ${updated.isActive ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      toast.error('Failed to update gateway status');
    }
  };

  const handleTestConnection = async (gateway: PaymentGateway) => {
    setTestingConnection(gateway.id);
    try {
      const success = await paymentGatewayService.testConnection(gateway);
      if (success) {
        toast.success(`Successfully connected to ${gateway.name}`);
      } else {
        toast.error(`Failed to connect to ${gateway.name}`);
      }
    } catch (error) {
      toast.error('Connection test failed');
    } finally {
      setTestingConnection(null);
    }
  };

  const handleSave = async (gateway: PaymentGateway, config: PaymentGateway['config']) => {
    try {
      const updated = await paymentGatewayService.updateGateway(gateway.id, {
        config: {
          ...gateway.config,
          ...config
        }
      });
      if (updated) {
        setGateways(gateways.map(g => g.id === gateway.id ? updated : g));
        toast.success('Gateway configuration updated');
      }
    } catch (error) {
      toast.error('Failed to update gateway configuration');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Gateways</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Stripe */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GatewayIcons.Stripe />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Stripe</h3>
                <p className="text-sm text-gray-500">Credit card payments via Stripe</p>
              </div>
            </div>
            <Switch
              checked={gateways.find(g => g.id === 'stripe')?.isActive || false}
              onChange={() => handleToggle(gateways.find(g => g.id === 'stripe')!)}
              className={`${
                gateways.find(g => g.id === 'stripe')?.isActive ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  gateways.find(g => g.id === 'stripe')?.isActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'stripe')?.config.mode}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'stripe')!, { mode: e.target.value as 'test' | 'live' })}
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'stripe')?.config.apiKey || ''}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'stripe')!, { apiKey: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Secret Key</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'stripe')?.config.secretKey || ''}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'stripe')!, { secretKey: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Webhook Secret</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'stripe')?.config.webhookSecret || ''}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'stripe')!, { webhookSecret: e.target.value })}
              />
            </div>

            <button
              onClick={() => handleTestConnection(gateways.find(g => g.id === 'stripe')!)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={testingConnection === 'stripe'}
            >
              {testingConnection === 'stripe' ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Testing Connection...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>
        </div>

        {/* PayPal */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GatewayIcons.PayPal />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">PayPal</h3>
                <p className="text-sm text-gray-500">Accept payments via PayPal</p>
              </div>
            </div>
            <Switch
              checked={gateways.find(g => g.id === 'paypal')?.isActive || false}
              onChange={() => handleToggle(gateways.find(g => g.id === 'paypal')!)}
              className={`${
                gateways.find(g => g.id === 'paypal')?.isActive ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  gateways.find(g => g.id === 'paypal')?.isActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'paypal')?.config.mode}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'paypal')!, { mode: e.target.value as 'test' | 'live' })}
              >
                <option value="test">Sandbox</option>
                <option value="live">Live</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Client ID</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'paypal')?.config.clientId || ''}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'paypal')!, { clientId: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Client Secret</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'paypal')?.config.clientSecret || ''}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'paypal')!, { clientSecret: e.target.value })}
              />
            </div>

            <button
              onClick={() => handleTestConnection(gateways.find(g => g.id === 'paypal')!)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={testingConnection === 'paypal'}
            >
              {testingConnection === 'paypal' ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Testing Connection...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>
        </div>

        {/* GoCardless */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GatewayIcons.GoCardless />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">GoCardless</h3>
                <p className="text-sm text-gray-500">Direct debit payments via GoCardless</p>
              </div>
            </div>
            <Switch
              checked={gateways.find(g => g.id === 'gocardless')?.isActive || false}
              onChange={() => handleToggle(gateways.find(g => g.id === 'gocardless')!)}
              className={`${
                gateways.find(g => g.id === 'gocardless')?.isActive ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  gateways.find(g => g.id === 'gocardless')?.isActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g => g.id === 'gocardless')?.config.mode}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'gocardless')!, { mode: e.target.value as 'test' | 'live' })}
              >
                <option value="test">Sandbox</option>
                <option value="live">Live</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Access Token</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'gocardless')?.config.apiKey || ''}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'gocardless')!, { apiKey: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Webhook Secret</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'gocardless')?.config.webhookSecret || ''}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'gocardless')!, { webhookSecret: e.target.value })}
              />
            </div>

            <button
              onClick={() => handleTestConnection(gateways.find(g => g.id === 'gocardless')!)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={testingConnection === 'gocardless'}
            >
              {testingConnection === 'gocardless' ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Testing Connection...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>
        </div>

        {/* Revolut */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GatewayIcons.Revolut />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Revolut</h3>
                <p className="text-sm text-gray-500">Accept payments via Revolut</p>
              </div>
            </div>
            <Switch
              checked={gateways.find(g => g.id === 'revolut')?.isActive || false}
              onChange={() => handleToggle(gateways.find(g => g.id === 'revolut')!)}
              className={`${
                gateways.find(g => g.id === 'revolut')?.isActive ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  gateways.find(g => g.id === 'revolut')?.isActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'revolut')?.config.mode}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'revolut')!, { mode: e.target.value as 'test' | 'live' })}
              >
                <option value="test">Sandbox</option>
                <option value="live">Live</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={gateways.find(g => g.id === 'revolut')?.config.apiKey || ''}
                onChange={(e) => handleSave(gateways.find(g => g.id === 'revolut')!, { apiKey: e.target.value })}
              />
            </div>

            <button
              onClick={() => handleTestConnection(gateways.find(g => g.id === 'revolut')!)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={testingConnection === 'revolut'}
            >
              {testingConnection === 'revolut' ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Testing Connection...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}