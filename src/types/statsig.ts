export interface Experiment {
  allocation: number;
  controlGroupID?: string | null;
  createdTime: number;
  creatorName: string;
  decisionTime?: number | null;
  description: string;
  endTime: number | null;
  groups: Group[];
  healthChecks: HealthCheck[];
  hypothesis: string;
  id: string;
  idType?: string;
  inlineTargetingRules?: unknown[];
  launchedGroupID?: string | null;
  lastModifiedTime?: number;
  name: string;
  otherMetrics?: ExperimentMetric[];
  owner?: { ownerName?: string } | null;
  primaryMetrics?: ExperimentMetric[];
  secondaryMetrics?: ExperimentMetric[];
  startTime: number | null;
  status: string;
  tags: string[];
  targetingGateID?: string | null;
  team?: string | null;
}

interface ExperimentMetric {
  name: string;
  type: string;
}

export type JsonData =
  | null
  | boolean
  | number
  | string
  | JsonData[]
  | { [key: string]: JsonData };

export interface DynamicConfig {
  createdTime: number;
  creatorName: string;
  defaultValue?: JsonData;
  defaultValueJsonC: string;
  description: string;
  id: string;
  isEnabled: boolean;
  lastModifiedTime: number;
  lastModifierName: string;
  name: string;
  tags: string[];
}

export interface FeatureGate {
  id: string;
  name: string;
  description: string;
  idType: string;
  lastModifierID: string;
  lastModifiedTime: number;
  lastModifierName: string;
  lastModifierEmail: string | null;
  creatorID: string;
  createdTime: number;
  creatorName: string;
  creatorEmail: string | null;
  targetApps: string[];
  holdoutIDs: string[];
  tags: string[];
  isEnabled: boolean;
  status: string;
  rules: unknown[];
  checksPerHour: number;
  type: string;
  typeReason: string;
  team: string | null;
  reviewSettings: {
    requiredReview: boolean;
    allowedReviewers: string[];
  };
  measureMetricLifts: boolean;
  owner: {
    ownerID: string;
    ownerName: string;
    ownerType: string;
    ownerEmail: string;
  };
  monitoringMetrics: unknown[];
  version?: number;
}

export interface GateOverride {
  passingUserIDs: string[];
  failingUserIDs: string[];
  passingCustomIDs?: string[];
  failingCustomIDs?: string[];
  environmentOverrides: {
    environment: string | null;
    unitID: string | null;
    passingIDs: string[];
    failingIDs: string[];
  }[];
}

export interface HealthCheck {
  description: string;
  name: string;
  status: string;
}

export interface Group {
  id: string;
  name: string;
  isControl?: boolean;
  parameterValues?: Record<string, JsonData>;
  shipped?: boolean;
  size: number;
}

export interface AuditLog {
  id: string;
  name: string;
  changeLog: string;
  actionType: string;
  date: string;
  time: string;
  updatedBy: string;
  updatedByUserID: string;
  modifierEmail: string;
  changes?: {
    rules?: {
      new: unknown[];
      old: unknown[];
    };
  };
  tags: string[];
  targetAppIDs: string[];
}

export interface StatsigUser {
  [key: string]: unknown;
  name?: string;
  userID?: string;
  statsigEnvironment?: { tier?: string };
  custom?: Record<string, unknown>;
  privateAttributes?: Record<string, unknown>;
}
