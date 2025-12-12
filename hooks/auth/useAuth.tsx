'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth.types';
import { validatePassword } from '../../lib/regex/password';

type AuthContextType = {
    access: string | null;
    setAccess: (t: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, firstName: string, lastName: string, password: string)  => Promise<void>,
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [access, setAccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // setLoading(true);
        // fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
        //     .then(async (r) => {
        //         if (r.ok) {
        //             const body = await r.json();
        //             setAccess(body.access);
        //         } else {
        //             setAccess(null);
        //         }
        //     })
        //     .catch(() => setAccess(null))
        //     .finally(() => setLoading(false));
    }, []);

    async function login(username: string, password: string) {
        
    }

    async function logout() {
        
    }

    async function register(email: string, firstName: string, lastName: string, password: string) {
        
    }

    return (
        <AuthContext.Provider value={{ access, setAccess, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}