
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

// Database record structure
export interface TrainingExample {
  id?: string;
  theme: string;       // Used for vector matching or filtering
  style: string;       // User's selected style
  original_input: object; // The full input JSON
  optimized_output: string; // The user-edited, "perfect" result
  created_at?: string;
}
