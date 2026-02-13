import { useState, useMemo, useCallback, useRef } from "react";
import type { User, SortConfig, SortField, FilterConfig } from "./types";
import { useDebounce } from "./hooks/useDebounce";
import { useDataFetcher } from "./hooks/useDataFetcher";
import { useToast } from "./hooks/useToast";
import { useVirtualScroll } from "./hooks/useVirtualScroll";
import { getCachedRiskScore } from "./utils/computeRiskScore";
import { simulateApiCall } from "./utils/api";
import { StatsBar } from "./components/StatsBar";
import { SortHeader } from "./components/SortHeader";
import { UserRow } from "./components/UserRow";
import { UserModal } from "./components/UserModal";
import { EmptyState, ErrorState, LoadingState, ToastContainer } from "./components/ui-State";

const USER_COUNT = 10_000;
const ROW_HEIGHT = 56;

export default function App() {
  const { users, isLoading, error, updateUser } = useDataFetcher(USER_COUNT);
  const { toasts, addToast, removeToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: "firstName", direction: "asc" });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({ department: "all", isActive: "all" });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Memoized filtering + sorting
  const processedUsers = useMemo(() => {
    let result = users;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q)
      );
    }

    if (filterConfig.department !== "all") {
      result = result.filter((u) => u.department === filterConfig.department);
    }

    if (filterConfig.isActive === "active") {
      result = result.filter((u) => u.isActive);
    } else if (filterConfig.isActive === "inactive") {
      result = result.filter((u) => !u.isActive);
    }

    result = [...result].sort((a, b) => {
      const field = sortConfig.field;
      const dir = sortConfig.direction === "asc" ? 1 : -1;

      if (field === "riskScore") {
        return (getCachedRiskScore(a).score - getCachedRiskScore(b).score) * dir;
      }

      const aVal = a[field as keyof User];
      const bVal = b[field as keyof User];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * dir;
      }
      return ((aVal as number) - (bVal as number)) * dir;
    });

    return result;
  }, [users, debouncedSearch, sortConfig, filterConfig]);

  // ── Virtualization ────────────────────────────────────────
  const { totalHeight, visibleItems } = useVirtualScroll(
    processedUsers.length,
    ROW_HEIGHT,
    scrollContainerRef
  );

  // ── Stable callbacks ──────────────────────────────────────
  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleRowClick = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const handleOptimisticSave = useCallback(
    async (userId: string, updates: Partial<User>) => {
      const originalUser = users.find((u) => u.id === userId);
      if (!originalUser) return;

      // Optimistic: apply immediately
      updateUser(userId, updates);
      setEditingUserId(userId);
      setSelectedUser((prev) => (prev && prev.id === userId ? { ...prev, ...updates } : prev));
      addToast("info", "Saving changes...");

      try {
        await simulateApiCall(updates);
        addToast("success", `User ${originalUser.firstName} updated successfully!`);
      } catch (err) {
        // Rollback
        updateUser(userId, originalUser);
        setSelectedUser((prev) => (prev && prev.id === userId ? originalUser : prev));
        addToast("error", (err as Error).message);
      } finally {
        setEditingUserId(null);
      }
    },
    [users, updateUser, addToast]
  );

  const handleDepartmentFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterConfig((prev) => ({ ...prev, department: e.target.value }));
  }, []);

  const handleStatusFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterConfig((prev) => ({ ...prev, isActive: e.target.value as FilterConfig["isActive"] }));
  }, []);

  const departments = useMemo(() => {
    const depts = new Set(users.map((u) => u.department));
    return Array.from(depts).sort();
  }, [users]);

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">Users Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                High-volume data management with virtualized rendering
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700/50">
                React + TypeScript
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700/50">
                Virtualized
              </span>
              <span className="px-2 py-1 rounded bg-violet-500/10 border border-violet-500/30 text-violet-400">
                {USER_COUNT.toLocaleString()} rows
              </span>
            </div>
          </div>
          {!isLoading && !error && <StatsBar users={users} filteredCount={processedUsers.length} />}
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-5">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, ID, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={filterConfig.department}
                onChange={handleDepartmentFilter}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:border-violet-500/50 focus:outline-none cursor-pointer"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={filterConfig.isActive}
                onChange={handleStatusFilter}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:border-violet-500/50 focus:outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              {debouncedSearch !== searchQuery && (
                <span className="text-xs text-slate-600 animate-pulse">Searching...</span>
              )}
            </div>

            {/* Table */}
            <div className="border border-slate-800/50 rounded-xl overflow-hidden bg-slate-900/30">
              {/* Header Row */}
              <div className="flex items-center px-4 py-3 bg-slate-900/80 border-b border-slate-800">
                <div className="w-[4%] min-w-[40px]" />
                <div className="w-[18%] min-w-[150px]">
                  <SortHeader label="Name" field="firstName" sortConfig={sortConfig} onSort={handleSort} />
                </div>
                <div className="w-[20%] min-w-[180px]">
                  <SortHeader label="Email" field="email" sortConfig={sortConfig} onSort={handleSort} />
                </div>
                <div className="w-[6%] min-w-[50px] text-center">
                  <SortHeader label="Age" field="age" sortConfig={sortConfig} onSort={handleSort} className="justify-center" />
                </div>
                <div className="w-[12%] min-w-[100px]">
                  <SortHeader label="Dept" field="department" sortConfig={sortConfig} onSort={handleSort} />
                </div>
                <div className="w-[10%] min-w-[90px]">
                  <SortHeader label="Salary" field="salary" sortConfig={sortConfig} onSort={handleSort} />
                </div>
                <div className="w-[10%] min-w-[80px]">
                  <SortHeader label="Joined" field="joinDate" sortConfig={sortConfig} onSort={handleSort} />
                </div>
                <div className="w-[8%] min-w-[60px]">
                  <SortHeader label="Perf" field="performanceScore" sortConfig={sortConfig} onSort={handleSort} />
                </div>
                <div className="w-[12%] min-w-[100px]">
                  <SortHeader label="Risk Score" field="riskScore" sortConfig={sortConfig} onSort={handleSort} />
                </div>
              </div>

              {/* Virtualized Body */}
              {processedUsers.length === 0 ? (
                <EmptyState query={debouncedSearch} />
              ) : (
                <div
                  ref={scrollContainerRef}
                  className="overflow-y-auto"
                  style={{ height: Math.min(processedUsers.length * ROW_HEIGHT, 600) }}
                >
                  <div style={{ height: totalHeight, position: "relative" }}>
                    {visibleItems.map(({ index, offsetTop }) => {
                      const user = processedUsers[index];
                      if (!user) return null;
                      return (
                        <UserRow
                          key={user.id}
                          user={user}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: ROW_HEIGHT,
                            transform: `translateY(${offsetTop}px)`,
                          }}
                          onClick={handleRowClick}
                          isEditing={editingUserId === user.id}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
              <span>
                Showing {processedUsers.length.toLocaleString()} of {users.length.toLocaleString()} users
                {debouncedSearch && ` · Search: "${debouncedSearch}"`}
              </span>
              <span>Row virtualization active · {ROW_HEIGHT}px row height</span>
            </div>
          </>
        )}
      </main>

      {/* Modal */}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} onSave={handleOptimisticSave} />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}