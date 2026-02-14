
import React from 'react';
import type { User } from '../context/UserContext';

interface UserRowProps {
  user: User;
  style: React.CSSProperties;
  onEdit: (user: User) => void;
}

export const UserRow: React.FC<UserRowProps> = React.memo(({ user, style, onEdit }) => {
  // Expensive computation removed as file was deleted

  return (
    <div
      style={style}
      className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors"
      onClick={() => onEdit(user)}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden mr-4 bg-gray-700 shrink-0">
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-100 truncate">{user.name}</p>
        <p className="text-sm text-gray-500 truncate">{user.email}</p>
      </div>
      <div className="hidden md:block w-32 px-2">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-900 text-green-200' :
          user.status === 'inactive' ? 'bg-red-900 text-red-200' : 'bg-yellow-900 text-yellow-200'
          }`}>
          {user.status}
        </span>
      </div>
      <div className="hidden md:block w-24 px-2 text-sm text-gray-400">
        {user.role}
      </div>
      <div className="hidden lg:block w-20 px-2 text-sm text-gray-400 text-right">
        {user.age} age
      </div>
      <div className="hidden xl:block w-32 px-2 text-xs text-gray-500 text-right">
        -
      </div>
    </div>
  );
});
