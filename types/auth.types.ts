export interface LoginRequest {
    usename: string;
    password: string;
}

export interface User {
    id: number;
    name?: string;
    avatarUrl?: string;
    role?: string;
}