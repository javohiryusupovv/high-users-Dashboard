

import { useState, useEffect, useCallback } from "react";
import type { User } from "../types";
import { generateUsers } from "../utils/generateUsers";

interface DataFetcherReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  updateUser: (userId: string, updates: Partial<User>) => void;
}


export function useDataFetcher(count: number): DataFetcherReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        const data = generateUsers(count);
        setUsers(data);
      } catch (e) {
        setError("Failed to generate user data");
      } finally {
        setIsLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [count]);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
  }, []);

  return { users, isLoading, error, updateUser };
}
