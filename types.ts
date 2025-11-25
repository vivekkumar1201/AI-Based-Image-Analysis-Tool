export interface FileData {
  file: File;
  previewUrl: string;
  base64: string; // Pure base64 string without mime prefix
  mimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface AnalysisResult {
  htmlReport: string;
}

export interface AnalysisError {
  message: string;
}