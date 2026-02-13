
import { memo } from "react";
import type { User } from "../types";
import { getCachedRiskScore } from "../utils/computeRiskScore";

interface UserRowProps {
  user: User;
  style: React.CSSProperties;
  onClick: (user: User) => void;
  isEditing: boolean;
}

export const UserRow = memo(function UserRow({
  user,
  style,
  onClick,
  isEditing,
}: UserRowProps) {
  const risk = getCachedRiskScore(user);

  return (
    <div
      style={style}
      onClick={() => onClick(user)}
      className={`flex items-center px-4 border-b border-slate-800/50 cursor-pointer transition-colors duration-150 ${
        isEditing
          ? "bg-violet-500/10 border-violet-500/30"
          : "hover:bg-slate-800/40"
      }`}
    >
      {/* Status dot */}
      <div className="w-[4%] min-w-[40px]">
        <div
          className={`w-2 h-2 rounded-full ${
            user.isActive ? "bg-emerald-400" : "bg-slate-600"
          }`}
        />
      </div>

      {/* Name + Avatar */}
      <div className="w-[18%] min-w-[150px] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div className="truncate">
          <div className="text-sm font-medium text-slate-100 truncate">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-slate-500 truncate">{user.id}</div>
        </div>
      </div>

      {/* Email */}
      <div className="w-[20%] min-w-[180px] text-sm text-slate-300 truncate pr-4">
        {user.email}
      </div>

      {/* Age */}
      <div className="w-[6%] min-w-[50px] text-sm text-slate-300 text-center">
        {user.age}
      </div>

      {/* Department */}
      <div className="w-[12%] min-w-[100px]">
        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
          {user.department}
        </span>
      </div>

      {/* Salary */}
      <div className="w-[10%] min-w-[90px] text-sm text-slate-200 font-mono">
        ${user.salary.toLocaleString()}
      </div>

      {/* Join Date */}
      <div className="w-[10%] min-w-[80px] text-sm text-slate-400">
        {user.joinDate}
      </div>

      {/* Performance */}
      <div className="w-[8%] min-w-[60px]">
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
              style={{ width: `${user.performanceScore}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {user.performanceScore}
          </span>
        </div>
      </div>

      {/* Risk Score (heavy computation, cached) */}
      <div className="w-[12%] min-w-[100px]">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono font-semibold ${risk.color}`}>
            {risk.score}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              risk.label === "Low"
                ? "bg-emerald-500/10 text-emerald-400"
                : risk.label === "Medium"
                  ? "bg-amber-500/10 text-amber-400"
                  : risk.label === "High"
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-red-500/10 text-red-400"
            }`}
          >
            {risk.label}
          </span>
        </div>
      </div>
    </div>
  );
});
