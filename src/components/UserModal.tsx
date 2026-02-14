
import React, { useState, useEffect } from 'react';
import type { User } from '../context/UserContext';

interface UserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 animate-fade-in-up border border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 focus:outline-none">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => {
                  const firstName = e.target.value;
                  setFormData(prev => ({ ...prev, firstName, name: `${firstName} ${prev.lastName}` }));
                }}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => {
                  const lastName = e.target.value;
                  setFormData(prev => ({ ...prev, lastName, name: `${prev.firstName} ${lastName}` }));
                }}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border outline-none"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Moderator">Moderator</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border outline-none"
              required
              min="0"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
