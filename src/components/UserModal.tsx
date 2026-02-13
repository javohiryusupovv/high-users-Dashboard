

import { useState, useEffect, useCallback } from "react";
import type { User } from "../types";
import { getCachedRiskScore } from "../utils/computeRiskScore";
import { DEPARTMENTS } from "../utils/generateUsers";

interface UserModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<User>) => void;
}

export function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
    salary: user.salary,
    isActive: user.isActive,
  });
  const [saving, setSaving] = useState(false);
  const risk = getCachedRiskScore(user);

  // Sync form when user prop changes (e.g., after rollback)
  useEffect(() => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department,
      salary: user.salary,
      isActive: user.isActive,
    });
  }, [user]);

  const handleSave = useCallback(() => {
    setSaving(true);
    onSave(user.id, form);
    setSaving(false);
    setEditMode(false);
  }, [user.id, form, onSave]);

  const handleChange = useCallback(
    (field: string, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-slate-400">
                {user.id} · {user.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-slate-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-400">{user.performanceScore}</div>
            <div className="text-xs text-slate-500 mt-1">Performance</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${risk.color}`}>{risk.score}</div>
            <div className="text-xs text-slate-500 mt-1">Risk Score</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${user.isActive ? "text-emerald-400" : "text-slate-500"}`}>
              {user.isActive ? "Active" : "Inactive"}
            </div>
            <div className="text-xs text-slate-500 mt-1">Status</div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!editMode ? (
            <>
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone} />
              <InfoRow label="Location" value={`${user.city}, ${user.country}`} />
              <InfoRow label="Salary" value={`$${user.salary.toLocaleString()}`} />
              <InfoRow label="Join Date" value={user.joinDate} />
              <InfoRow label="Age" value={String(user.age)} />
              <button
                onClick={() => setEditMode(true)}
                className="w-full mt-4 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors"
              >
                Edit User
              </button>
            </>
          ) : (
            <>
              <EditField label="First Name" value={form.firstName} onChange={(v) => handleChange("firstName", v)} />
              <EditField label="Last Name" value={form.lastName} onChange={(v) => handleChange("lastName", v)} />
              <EditField label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <EditField
                label="Salary"
                value={String(form.salary)}
                onChange={(v) => handleChange("salary", Number(v))}
                type="number"
              />
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-500">Active Status</label>
                <button
                  onClick={() => handleChange("isActive", !form.isActive)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    form.isActive ? "bg-emerald-500" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      form.isActive ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
              <p className="text-xs text-slate-600 text-center mt-2">
                Optimistic update: changes appear instantly. ~30% simulated failure rate with rollback.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm text-slate-200">{value}</span>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
      />
    </div>
  );
}
