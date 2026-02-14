
// All TypeScript interfaces and types for the dashboard

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Computed
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  age: number;
  avatar: string;
  // Extended fields for computeRiskScore
  salary: number;
  performanceScore: number;
  joinDate: string;
  department: string; // Optional or generated
  isActive: boolean; // Computed or alias for status === 'active'
}

export type SortField =
  | "firstName"
  | "lastName"
  | "email"
  | "age"
  | "department"
  | "salary"
  | "joinDate"
  | "performanceScore"
  | "riskScore";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  department: string;
  isActive: "all" | "active" | "inactive";
}

export interface EditableUserFields {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  salary: number;
  isActive: boolean;
}

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
