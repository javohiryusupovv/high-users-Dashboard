
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useUsers } from '../context/UserContext';
import type { User } from '../context/UserContext';
import { UserRow } from './UserRow';

interface VirtualTableProps {
    onEdit: (user: User) => void;
}

export const VirtualTable: React.FC<VirtualTableProps> = ({ onEdit }) => {
    const { filteredUsers, sorting, setSorting, loading, error } = useUsers();

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: filteredUsers.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60, // approximate row height
        overscan: 5,
    });

    if (loading && filteredUsers.length === 0) return <div className="p-4 text-center">Loading users...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    if (filteredUsers.length === 0) return <div className="p-4 text-center">No users found.</div>;

    const handleSort = (key: keyof User) => {
        const isAsc = sorting?.key === key && sorting.order === 'asc';
        setSorting(key, isAsc ? 'desc' : 'asc');
    };

    const getSortIcon = (key: keyof User) => {
        if (sorting?.key !== key) {
            return <span className="text-gray-600  ml-1">▼</span>;
        }
        return <span className="text-blue-400 ml-1">{sorting.order === 'asc' ? '▲' : '▼'}</span>;
    };

    return (
        <div className="flex flex-col border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-sm">
            {/* Header */}
            <div className="flex bg-gray-900 font-semibold text-gray-300 border-b border-gray-700">
                <div className="p-4 flex-1 cursor-pointer hover:bg-gray-800 transition-colors flex items-center" onClick={() => handleSort('name')}>
                    Name {getSortIcon('name')}
                </div>
                <div className="p-4 hidden md:flex w-32 cursor-pointer hover:bg-gray-800 transition-colors items-center" onClick={() => handleSort('status')}>
                    Status {getSortIcon('status')}
                </div>
                <div className="p-4 hidden md:flex w-24 cursor-pointer hover:bg-gray-800 transition-colors items-center" onClick={() => handleSort('role')}>
                    Role {getSortIcon('role')}
                </div>
                <div className="p-4 hidden lg:flex w-20 justify-end cursor-pointer hover:bg-gray-800 transition-colors items-center" onClick={() => handleSort('age')}>
                    Age {getSortIcon('age')}
                </div>
                <div className="p-4 hidden xl:block w-32 text-right">
                    Computation
                </div>
            </div>

            {/* Virtualized List */}
            <div
                ref={parentRef}
                style={{ height: '600px', overflow: 'auto' }} // Fixed height for virtualization container
                className="w-full"
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const user = filteredUsers[virtualRow.index];
                        return (
                            <div
                                key={user.id}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <UserRow
                                    user={user}
                                    style={{ height: '100%' }} // row height passed to component
                                    onEdit={onEdit}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
