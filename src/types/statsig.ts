export interface Experiment {
  createdTime: number;
  creatorName: string;
  description: string;
  endTime: number;
  groups: Group[];
  hypothesis: string;
  id: string;
  name: string;
  startTime: number;
  status: string;
  tags: string[];
}

export interface Group {
  id: string;
  name: string;
  size: number;
}
