export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: {
    login: string;
    name: string | null;
    avatar_url: string;
  };
}

export interface OAuthInitResponse {
  authUrl: string;
}
