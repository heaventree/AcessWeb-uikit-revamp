
import React, { useEffect, useState } from 'react';
import { verificationFramework } from '../../verification/implementation-verification';

/**
 * Implementation Verification Dashboard
 * 
 * Provides a visual interface to monitor the progress of component implementation
 * across the application, addressing the documentation-implementation gap.
 */
const ImplementationDashboard: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  useEffect(() => {
    // Generate the verification report
    const generatedReport = verificationFramework.generateReport();
    setReport(generatedReport);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-4">Loading implementation verification data...</div>;
  }

  if (!report) {
    return <div className="p-4">No verification data available.</div>;
  }

  // Filter components based on selected status
  const filterComponents = () => {
    if (selectedStatus === 'All') {
      return Object.values(report.componentsByStatus).flat();
    }
    return report.componentsByStatus[selectedStatus] || [];
  };

  const filteredComponents = filterComponents();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Implementation Verification Dashboard</h1>
      
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Components</h3>
          <p className="text-3xl font-bold">{report.totalComponents}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Implementation Rate</h3>
          <p className="text-3xl font-bold">{report.implementationRate.toFixed(1)}%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Test Coverage</h3>
          <p className="text-3xl font-bold">{report.averageTestCoverage.toFixed(1)}%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Verified Components</h3>
          <p className="text-3xl font-bold">{report.implementationStatus['Tested']}</p>
        </div>
      </div>
      
      {/* Status breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Implementation Status</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-red-100 p-3 rounded">
            <h3 className="font-medium">Not Started</h3>
            <p className="text-2xl font-bold">{report.implementationStatus['Not Started']}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded">
            <h3 className="font-medium">In Progress</h3>
            <p className="text-2xl font-bold">{report.implementationStatus['In Progress']}</p>
          </div>
          <div className="bg-green-100 p-3 rounded">
            <h3 className="font-medium">Complete</h3>
            <p className="text-2xl font-bold">{report.implementationStatus['Complete']}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded">
            <h3 className="font-medium">Tested</h3>
            <p className="text-2xl font-bold">{report.implementationStatus['Tested']}</p>
          </div>
        </div>
      </div>
      
      {/* Component listing */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Component Details</h2>
          <div>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded p-2"
            >
              <option value="All">All Components</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Tested">Tested</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Coverage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComponents.length > 0 ? (
                filteredComponents.map((component: any) => (
                  <tr key={component.componentId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{component.componentName}</div>
                      <div className="text-sm text-gray-500">{component.implementationPath}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${component.implementationStatus === 'Not Started' ? 'bg-red-100 text-red-800' : ''}
                        ${component.implementationStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${component.implementationStatus === 'Complete' ? 'bg-green-100 text-green-800' : ''}
                        ${component.implementationStatus === 'Tested' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {component.implementationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{component.testCoverage}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {component.lastVerifiedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">View</a>
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No components found with the selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImplementationDashboard;
