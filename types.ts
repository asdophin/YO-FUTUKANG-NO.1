
export interface SummaryFormData {
  weather: string;
  theme: string;
  abstract: string;
  style: string;
  specialRequests: string;
}

export interface Template {
  id: string;
  label: string;
  content: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationResult {
  content: string;
  status: GenerationStatus;
  errorMessage?: string;
}
