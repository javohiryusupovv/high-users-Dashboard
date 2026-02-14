
import React, { useState, useEffect } from 'react';
import { useUsers } from '../context/UserContext';

export const FilterBar: React.FC = () => {
    const { filters, setFilter } = useUsers();
    const [localQuery, setLocalQuery] = useState(filters.query);

    // Bounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            if (localQuery !== filters.query) {
                setFilter(localQuery, filters.role);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [localQuery, filters.role, setFilter, filters.query]);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(localQuery, e.target.value);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-800 shadow-sm rounded-lg mb-4 border border-gray-700">
            <input
                type="text"
                placeholder="Search by name or email..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="flex-1 p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <select
                value={filters.role}
                onChange={handleRoleChange}
                className="p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Moderator">Moderator</option>
                <option value="Guest">Guest</option>
            </select>
        </div>
    );
};
