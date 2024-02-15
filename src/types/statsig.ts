export interface Experiment {
  allocation: number;
  createdTime: number;
  creatorName: string;
  description: string;
  endTime: number;
  groups: Group[];
  healthChecks: HealthCheck[];
  hypothesis: string;
  id: string;
  name: string;
  startTime: number;
  status: string;
  tags: string[];
}

export interface HealthCheck {
  description: string;
  name: string;
  status: 'PASSED' | 'WAITING';
}

export interface Group {
  id: string;
  name: string;
  parameterValues: ParameterValue;
  size: number;
}

interface ParameterValue {
  [key: string]: boolean | number | string;
}
