export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ProblemDetails;
}

export interface ProblemDetails {
  status: number;
  title: string;
  type: string;
  detail: string;
  errors: ErrorObject[];
}

export interface ErrorObject {
  code: string;
  description: string;
  type: number;
}
