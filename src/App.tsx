
import { useState } from 'react';
import { UserProvider, useUsers } from './context/UserContext';
import type { User } from './context/UserContext';
import { VirtualTable } from './components/VirtualTable';
import { FilterBar } from './components/FilterBar';
import { UserModal } from './components/UserModal';

const DashboardContent = () => {
  const { users } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateUser } = useUsers();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser);
      // Optional: Show success toast
    } catch (error) {
      // Optional: Show error toast (handled by console error in context for now)
      alert("Failed to update user due to simulated error. Rolling back.");
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
        <p className="text-gray-400">Managing {users.length} users</p>
      </header>

      <FilterBar />

      <div className="flex-1 min-h-0">
        <VirtualTable onEdit={handleEdit} />
      </div>

      {selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <DashboardContent />
      </div>
    </UserProvider>
  );
}

export default App;