'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth.types';
import { loginApi, registerApi, ApiError } from '@/lib/services/auth.service';

type AuthContextType = {
    user: User | null;
    token: string | null;
    setToken: (t: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    loading: boolean;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem(TOKEN_KEY);
                const storedUser = localStorage.getItem(USER_KEY);

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear corrupted data
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    async function login(email: string, password: string) {
        setLoading(true);
        try {
            const response = await loginApi(email, password);

            if (response.status === 200 && response.data) {
                const { token: authToken, user: userData } = response.data;

                // Store token and user in localStorage
                localStorage.setItem(TOKEN_KEY, authToken);
                localStorage.setItem(USER_KEY, JSON.stringify(userData));

                // Update state
                setToken(authToken);
                setUser(userData);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            // Clear any existing auth data on error
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);

            // Re-throw with proper error format
            const apiError: ApiError = {
                status: error.status || 500,
                message: error.message || 'Login failed',
                detail: error.detail || error.message || 'An error occurred during login',
            };
            throw apiError;
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            // Clear localStorage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);

            // Clear state
            setToken(null);
            setUser(null);

            // Optionally call logout API endpoint here if needed
            // await logoutApi();
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if logout API fails, clear local state
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
        }
    }

    async function register(fullName: string, email: string, password: string, confirmPassword: string) {
        setLoading(true);
        try {
            const response = await registerApi(fullName, email, password, confirmPassword);

            if (response.status === 201 && response.data) {
                // Registration successful - user data is returned but no token
                // User needs to login after registration
                // Optionally, you can save email to localStorage for auto-fill on login page
                localStorage.setItem('newUser', email);
                
                // Don't set token/user here - user needs to login separately
                // This is a common pattern for security
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: any) {
            // Re-throw with proper error format
            const apiError: ApiError = {
                status: error.status || 500,
                message: error.message || 'Registration failed',
                detail: error.detail || error.message || 'An error occurred during registration',
            };
            throw apiError;
        } finally {
            setLoading(false);
        }
    }

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                setToken,
                login,
                logout,
                register,
                loading,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
