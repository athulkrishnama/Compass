export interface HttpResponse<T extends object> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}
