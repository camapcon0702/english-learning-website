import { API_CONFIG } from '@/lib/constants/app.constants';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
      createdAt: string;
    };
    token: string;
  };
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string | null;
  };
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

/**
 *
 * @param email
 * @param password
 * @returns
 * @throws
 */
export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Login failed',
        detail: data.detail || data.message || 'An error occurred during login',
      };
      throw error;
    }

    return data as LoginResponse;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

/**
 * Register API call
 * @param fullName - User full name
 * @param email - User email
 * @param password - User password
 * @param confirmPassword - Password confirmation
 * @returns Promise with register response
 * @throws Error if registration fails
 */
export async function registerApi(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Registration failed',
        detail: data.detail || data.message || 'An error occurred during registration',
      };
      throw error;
    }

    return data as RegisterResponse;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

