
// Sortable column header with visual indicator

import { memo } from "react";
import type { SortField, SortConfig } from "../types";

interface SortHeaderProps {
  label: string;
  field: SortField;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  className?: string;
}

export const SortHeader = memo(function SortHeader({
  label,
  field,
  sortConfig,
  onSort,
  className = "",
}: SortHeaderProps) {
  const isActive = sortConfig.field === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-white transition-colors group ${className} ${
        isActive ? "text-violet-400" : "text-slate-400"
      }`}
    >
      {label}
      <span
        className={`transition-transform ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
        }`}
      >
        {isActive && sortConfig.direction === "desc" ? "↓" : "↑"}
      </span>
    </button>
  );
});
