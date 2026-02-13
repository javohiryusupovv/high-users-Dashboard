

import type { User } from "../types";


//user type status
interface RiskResult {
  score: number;
  label: "Low" | "Medium" | "High" | "Critical";
  color: string;
}


//users hash tables
function computeRiskScore(user: User): RiskResult {
  let hash = 0;
  const str = user.id + user.email + user.salary + user.performanceScore;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }

  let risk = Math.abs(hash % 1000) / 10;
  for (let j = 0; j < 150; j++) {
    risk = Math.sin(risk + user.age * 0.01) * 50 + 50;
    risk =
      (risk + Math.cos(user.salary * 0.00001 + j) * 10 + user.performanceScore * 0.3) / 2;
  }

  const tenure =
    (Date.now() - new Date(user.joinDate).getTime()) / (365.25 * 24 * 3600 * 1000);
  risk = risk * (1 - tenure * 0.02) + (100 - user.performanceScore) * 0.2;
  risk = Math.max(0, Math.min(100, risk));

  const score = Math.round(risk * 10) / 10;
  const label: RiskResult["label"] =
    score < 30 ? "Low" : score < 60 ? "Medium" : score < 80 ? "High" : "Critical";
  const color =
    score < 30
      ? "text-emerald-400"
      : score < 60
        ? "text-amber-400"
        : score < 80
          ? "text-orange-400"
          : "text-red-400";

  return { score, label, color };
}



const riskScoreCache = new Map<string, RiskResult>();


//cache memorazation
export function getCachedRiskScore(user: User): RiskResult {
  const key = `${user.id}_${user.salary}_${user.performanceScore}_${user.age}`;

  const cached = riskScoreCache.get(key);
  if (cached) return cached;

  const result = computeRiskScore(user);
  riskScoreCache.set(key, result);
  return result;
}
