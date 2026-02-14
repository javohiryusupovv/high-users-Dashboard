
import React, { createContext, useReducer, useEffect, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';

// --- Types ---
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    name: string; // Computed for display/sorting
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    age: number;
    avatar: string;
}

interface UserState {
    users: User[];
    filteredUsers: User[];
    loading: boolean;
    error: string | null;
    filters: {
        query: string;
        role: string;
    };
    sorting: {
        key: keyof User;
        order: 'asc' | 'desc';
    } | null;
}

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: User[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SET_FILTER'; payload: { query?: string; role?: string } }
    | { type: 'SET_SORTING'; payload: { key: keyof User; order: 'asc' | 'desc' } }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'ROLLBACK_USER'; payload: User };

interface UserContextType extends UserState {
    setFilter: (query: string, role: string) => void;
    setSorting: (key: keyof User, order: 'asc' | 'desc') => void;
    updateUser: (user: User) => Promise<void>;
}

// --- Initial State ---
const initialState: UserState = {
    users: [],
    filteredUsers: [],
    loading: false,
    error: null,
    filters: { query: '', role: '' },
    sorting: null,
};

// --- Utils ---
const applyFiltersAndSort = (users: User[], filters: UserState['filters'], sorting: UserState['sorting']): User[] => {
    let result = [...users];

    // Filter
    if (filters.query) {
        const query = filters.query.toLowerCase();
        result = result.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }
    if (filters.role) {
        result = result.filter((user) => user.role === filters.role);
    }

    // Sort
    if (sorting) {
        result.sort((a, b) => {
            const aValue = a[sorting.key];
            const bValue = b[sorting.key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sorting.order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sorting.order === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }

    return result;
};

const userReducer = (state: UserState, action: Action): UserState => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                users: action.payload,
                filteredUsers: applyFiltersAndSort(action.payload, state.filters, state.sorting),
            };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'SET_FILTER': {
            const newFilters = { ...state.filters, ...action.payload };
            return {
                ...state,
                filters: newFilters,
                filteredUsers: applyFiltersAndSort(state.users, newFilters, state.sorting),
            };
        }
        case 'SET_SORTING': {
            const newSorting = action.payload;
            return {
                ...state,
                sorting: newSorting,
                filteredUsers: applyFiltersAndSort(state.users, state.filters, newSorting),
            };
        }
        case 'UPDATE_USER': {
            const updatedUsers = state.users.map(u => u.id === action.payload.id ? action.payload : u);
            return {
                ...state,
                users: updatedUsers,
                filteredUsers: applyFiltersAndSort(updatedUsers, state.filters, state.sorting),
            };
        }
        case 'ROLLBACK_USER': {
            const rolledBackUsers = state.users.map(u => u.id === action.payload.id ? action.payload : u);
            return {
                ...state,
                users: rolledBackUsers,
                filteredUsers: applyFiltersAndSort(rolledBackUsers, state.filters, state.sorting),
            };
        }
        default:
            return state;
    }
};

// --- Context ---
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const response = await fetch('https://gist.githubusercontent.com/diondree/92e4518ca7529e1f4d1300993e5cc287/raw/5e689bb33a11a2e55cb11e6f413ddea14c4be804/mock-data-10000.json');
                if (!response.ok) throw new Error('Failed to fetch data');
                const rawData = await response.json();

                // Map API data to app state and augment with random data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedData: User[] = rawData.map((item: any) => ({
                    id: item._id,
                    firstName: item.first_name,
                    lastName: item.last_name,
                    name: `${item.first_name} ${item.last_name}`,
                    email: item.email,
                    // Randomly generate missing fields
                    role: Math.random() > 0.8 ? 'Admin' : Math.random() > 0.6 ? 'Moderator' : 'User',
                    status: Math.random() > 0.8 ? 'inactive' : Math.random() > 0.9 ? 'pending' : 'active',
                    age: Math.floor(Math.random() * (60 - 18 + 1)) + 18,
                    avatar: `https://ui-avatars.com/api/?name=${item.first_name}+${item.last_name}&background=random`
                }));

                dispatch({ type: 'FETCH_SUCCESS', payload: mappedData });
            } catch (error) {
                dispatch({ type: 'FETCH_ERROR', payload: (error as Error).message });
            }
        };

        fetchData();
    }, []);

    const setFilter = useCallback((query: string, role: string) => {
        dispatch({ type: 'SET_FILTER', payload: { query, role } });
    }, []);

    const setSorting = useCallback((key: keyof User, order: 'asc' | 'desc') => {
        dispatch({ type: 'SET_SORTING', payload: { key, order } });
    }, []);

    const updateUser = useCallback(async (updatedUser: User) => {
        // 1. Optimistic Update
        const previousUser = state.users.find(u => u.id === updatedUser.id);
        if (!previousUser) return;

        dispatch({ type: 'UPDATE_USER', payload: updatedUser });

        // 2. Simulate API Call
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate random failure (10% chance)
                    // The task asks for Simulated random failure + rollback
                    if (Math.random() < 0.1) {
                        reject(new Error('Simulated random failure'));
                    } else {
                        resolve(true);
                    }
                }, 1000);
            });
        } catch (error) {
            // 3. Rollback on failure
            console.error("Update failed, rolling back", error);
            dispatch({ type: 'ROLLBACK_USER', payload: previousUser });
            throw error; // Re-throw to let UI know
        }
    }, [state.users]);

    return (
        <UserContext.Provider value={{ ...state, setFilter, setSorting, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
};
