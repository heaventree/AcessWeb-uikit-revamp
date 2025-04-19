import React from 'react';
import { RealTimeMonitor } from '../components/RealTimeMonitor';

export function RealTimeMonitorPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Real-Time Monitoring
          </h1>
          <p className="text-lg text-gray-600">
            Monitor your website's accessibility status in real-time with instant alerts
          </p>
        </div>

        <RealTimeMonitor />
      </div>
    </div>
  );
}