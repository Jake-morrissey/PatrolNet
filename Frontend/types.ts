export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export enum Status {
  SECURE = 'Secure',
  WARNING = 'Warning',
  AT_RISK = 'At Risk'
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  remediation: string;
  technicalDetails?: string;
}

export interface Domain {
  id: string;
  name: string;
  score: number;
  lastScan: string; // ISO Date string
  status: Status;
  findings: Finding[];
}

export interface ScoreHistoryPoint {
  date: string;
  score: number;
}

export type PlanType = 'Starter' | 'Pro' | 'Enterprise' | 'Cancelled';

export interface User {
  name: string;
  email: string;
  plan: PlanType;
}
