import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import type { Package } from '../../types';

// Initial test data
const initialPackages: Package[] = [
  {
    id: '1',
    name: 'Basic',
    price: 999,
    description: 'Perfect for small websites and personal projects',
    features: [
      'Up to 5 pages per scan',
      'Weekly automated scans',
      'Basic accessibility reports',
      'Email notifications',
      'Standard support'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Professional',
    price: 2999,
    description: 'Ideal for growing businesses and agencies',
    features: [
      'Up to 25 pages per scan',
      'Daily automated scans',
      'Advanced accessibility reports',
      'Priority email support',
      'Custom badge styles',
      'API access',
      'Multiple team members'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 9999,
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited pages per scan',
      'Real-time monitoring',
      'Custom scan schedules',
      'Dedicated support manager',
      'Custom integrations',
      'SLA guarantees',
      'Advanced analytics',
      'Multiple domains'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01')
  }
];

interface PackageFormData {
  name: string;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
}

const initialFormData: PackageFormData = {
  name: '',
  price: 0,
  description: '',
  features: [''],
  isActive: true
};

export function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<PackageFormData>(initialFormData);

  const handleOpenModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        price: pkg.price,
        description: pkg.description,
        features: pkg.features,
        isActive: pkg.isActive
      });
    } else {
      setEditingPackage(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
    setFormData(initialFormData);
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPackage) {
        // Update existing package
        const updatedPackage = {
          ...editingPackage,
          ...formData,
          updatedAt: new Date()
        };
        setPackages(packages.map(p => p.id === editingPackage.id ? updatedPackage : p));
        toast.success('Package updated successfully');
      } else {
        // Create new package
        const newPackage: Package = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setPackages([...packages, newPackage]);
        toast.success('Package created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save package');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        setPackages(packages.filter(p => p.id !== id));
        toast.success('Package deleted successfully');
      } catch (error) {
        toast.error('Failed to delete package');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Packages</h2>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Package
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="divide-y divide-gray-200">
          {packages.map((pkg) => (
            <div key={pkg.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{pkg.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleOpenModal(pkg)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${(pkg.price / 100).toFixed(2)}
                </p>
                <ul className="mt-4 space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 text-green-500 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </Dialog.Title>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Package Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (in cents)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Feature
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}